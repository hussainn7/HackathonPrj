# graph_api.py
"""
FastAPI app to serve all nodes and relationships from the PostgreSQL knowledge graph database for vis.js visualization.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import psycopg2
from psycopg2.extras import RealDictCursor

app = FastAPI()

# Allow CORS for local HTML file
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()
pg_host = os.getenv("PGHOST", "localhost")
pg_db = os.getenv("PGDATABASE", "knowledge_graph")
pg_user = os.getenv("PGUSER", "postgres")
pg_password = os.getenv("PGPASSWORD", "")
pg_port = os.getenv("PGPORT", "5432")

def get_db_conn():
    return psycopg2.connect(
        host=pg_host,
        dbname=pg_db,
        user=pg_user,
        password=pg_password,
        port=pg_port
    )

@app.get("/graph_data")
def get_graph_data():
    conn = get_db_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    # Get all nodes with their type if available (assume name format: 'Name (Type)')
    cur.execute('SELECT id, name FROM nodes;')
    nodes = []
    for row in cur.fetchall():
        name = row['name']
        if '(' in name and name.endswith(')'):
            base, typ = name.rsplit('(', 1)
            nodes.append({
                'id': row['id'],
                'name': base.strip(),
                'type': typ[:-1].strip()
            })
        else:
            nodes.append({
                'id': row['id'],
                'name': name,
                'type': None
            })
    # Get all relationships
    cur.execute('''
        SELECT r.id, r.source as "from", r.target as "to", r.label
        FROM relationships r
    ''')
    edges = []
    for row in cur.fetchall():
        edges.append({
            'id': row['id'],
            'from': row['from'],
            'to': row['to'],
            'label': row['label']
        })
    cur.close()
    conn.close()
    return { 'nodes': nodes, 'edges': edges }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
