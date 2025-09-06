# analyze_text.py
"""
This script takes a text file, extracts nodes and relationships using Gemini via LangChain, and outputs data for visualization with vis.js.
"""
from dotenv import load_dotenv
import os
from langchain_experimental.graph_transformers import LLMGraphTransformer
from langchain_core.documents import Document
from langchain_google_genai import ChatGoogleGenerativeAI

# Load environment variables
load_dotenv()

gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    raise ValueError("GEMINI_API_KEY not found in environment variables.")


# Initialize Gemini LLM
llm = ChatGoogleGenerativeAI(api_key=gemini_api_key, model="gemini-pro", temperature=0)

graph_transformer = LLMGraphTransformer(llm=llm)

# Path to your input text file
text_path = 'input_text.txt'

with open(text_path, 'r') as f:
    text = f.read()

documents = [Document(page_content=text)]

# Use async for best performance (if in Jupyter, use asyncio.run or nest_asyncio)
import asyncio
async def extract_graph():
    return await graph_transformer.aconvert_to_graph_documents(documents)

graph_documents = asyncio.run(extract_graph())


# Insert nodes and relationships into PostgreSQL
import psycopg2
from psycopg2.extras import execute_values

# Database connection info from environment
pg_host = os.getenv("PGHOST", "localhost")
pg_db = os.getenv("PGDATABASE", "knowledge_graph")
pg_user = os.getenv("PGUSER", "postgres")
pg_password = os.getenv("PGPASSWORD", "")
pg_port = os.getenv("PGPORT", "5432")

conn = psycopg2.connect(
    host=pg_host,
    dbname=pg_db,
    user=pg_user,
    password=pg_password,
    port=pg_port
)
cur = conn.cursor()

# Create tables if they don't exist
cur.execute('''
CREATE TABLE IF NOT EXISTS nodes (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE
);
''')
cur.execute('''
CREATE TABLE IF NOT EXISTS relationships (
    id SERIAL PRIMARY KEY,
    source INTEGER REFERENCES nodes(id),
    target INTEGER REFERENCES nodes(id),
    label TEXT
);
''')
conn.commit()

# Parse nodes and relationships from graph_documents
nodes_set = set()
edges = []
for doc in graph_documents:
    data = doc.dict()
    for node in data.get('nodes', []):
        nodes_set.add(node['id'] if 'id' in node else node['name'])
    for rel in data.get('relationships', []):
        source = rel.get('source', rel.get('from'))
        target = rel.get('target', rel.get('to'))
        label = rel.get('label', rel.get('type', 'related'))
        edges.append((source, target, label))

# Insert nodes (ignore duplicates)
for node in nodes_set:
    cur.execute('INSERT INTO nodes (name) VALUES (%s) ON CONFLICT (name) DO NOTHING;', (node,))
conn.commit()

# Get node name to id mapping
cur.execute('SELECT id, name FROM nodes;')
node_id_map = {name: nid for nid, name in cur.fetchall()}

# Insert relationships (ignore duplicates by unique constraint if desired)
for source, target, label in edges:
    src_id = node_id_map.get(source)
    tgt_id = node_id_map.get(target)
    if src_id and tgt_id:
        cur.execute('''
            INSERT INTO relationships (source, target, label)
            VALUES (%s, %s, %s)
        ''', (src_id, tgt_id, label))
conn.commit()

cur.close()
conn.close()

print("Nodes and relationships added to PostgreSQL database.")
