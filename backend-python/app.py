import os
import json
from flask import Flask, request, jsonify
import google.generativeai as genai
from pdfminer.high_level import extract_text
from werkzeug.utils import secure_filename
from flask_cors import CORS
import bcrypt
import jwt
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta

genai.configure(api_key="AIzaSyCSqscxiqlJ9VKMX59P65tq-Meatj3-zno")
model = genai.GenerativeModel("gemini-1.5-flash")

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
CORS(app)

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Database configuration
SECRET = os.getenv('JWT_SECRET', 'alexandria_secret')
DATABASE_URL = 'postgresql://user:52Bw6OgjAcbW9VRpmLFfwNBagyc6WtT9@dpg-d2u4hv7fte5s73aq7a9g-a.ohio-postgres.render.com/forsyth_hacks_db'

def get_db_connection():
    return psycopg2.connect(DATABASE_URL, sslmode='require', cursor_factory=RealDictCursor)

def ensure_users_table():
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            CREATE EXTENSION IF NOT EXISTS "pgcrypto";
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email TEXT UNIQUE,
                display_name TEXT,
                is_verified_librarian BOOLEAN DEFAULT FALSE,
                reputation INT DEFAULT 0,
                created_at TIMESTAMPTZ DEFAULT now(),
                password_hash TEXT NOT NULL
            );
        """)
        conn.commit()
    except Exception as e:
        print(f"Error creating table: {e}")
    finally:
        cur.close()
        conn.close()

def detect_language_with_gemini(text: str) -> dict:
    prompt = f"""
    You are a language detector and translator.
    Given the following text, return valid JSON only.

    JSON format:
    {{
      "detected_language": "name of language in English",
      "iso_code": "ISO 639-1 code (like 'en', 'fr', 'el')",
      "translation_to_english": "short English translation of the text"
    }}
    Text:
    ---
    {text[:3000]}
    ---
    """
    resp = model.generate_content(
        prompt,
        generation_config={"response_mime_type": "application/json"}
    )
    return resp.text

def generate_summary_with_language(text: str, target_language: str) -> str:
    """Generate a summary of the text in the specified language using Gemini"""
    prompt = f"""
    You are a professional document summarizer. 
    Please create a comprehensive summary of the following text in {target_language}.
    
    Instructions:
    - Provide a clear, concise summary that captures the main points
    - Use proper grammar and formatting in {target_language}
    - If the target language is not English, ensure natural translation
    - Keep the summary informative but accessible
    
    Text to summarize:
    ---
    {text}
    ---
    
    Please provide the summary in {target_language}:
    """
    
    resp = model.generate_content(prompt)
    return resp.text

@app.route('/api/pdf-language', methods=['POST'])
def pdf_language():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    text = extract_text(filepath)
    if not text.strip():
        return jsonify({'error': 'No text extracted from PDF. It may be scanned (need OCR).'}), 400
    
    # Get language detection result
    language_result = detect_language_with_gemini(text)
    
    try:
        language_data = json.loads(language_result)
        return jsonify({
            'transcript': text,
            'detected_language': language_data.get('detected_language'),
            'iso_code': language_data.get('iso_code'),
            'translation_to_english': language_data.get('translation_to_english')
        })
    except json.JSONDecodeError:
        return jsonify({'error': 'Failed to parse language detection result'}), 500

@app.route('/api/generate-summary', methods=['POST'])
def generate_summary():
    data = request.get_json()
    
    if not data or 'transcript' not in data or 'language' not in data:
        return jsonify({'error': 'Missing transcript or language in request'}), 400
    
    transcript = data['transcript']
    target_language = data['language']
    
    if not transcript.strip():
        return jsonify({'error': 'Empty transcript provided'}), 400
    
    try:
        summary = generate_summary_with_language(transcript, target_language)
        return jsonify({
            'summary': summary,
            'language': target_language
        })
    except Exception as e:
        return jsonify({'error': f'Failed to generate summary: {str(e)}'}), 500

# Authentication endpoints
@app.route('/api/auth/register', methods=['POST'])
def register():
    ensure_users_table()
    data = request.get_json()
    
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Email and password required.'}), 400
    
    email = data['email']
    password = data['password']
    display_name = data.get('display_name')
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Check if user already exists
        cur.execute('SELECT id FROM users WHERE email = %s', (email,))
        if cur.fetchone():
            return jsonify({'error': 'Email already registered.'}), 400
        
        # Hash password and create user
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        cur.execute(
            'INSERT INTO users (email, password_hash, display_name) VALUES (%s, %s, %s)',
            (email, password_hash, display_name)
        )
        conn.commit()
        
        return jsonify({'message': 'Account created successfully.'}), 201
        
    except Exception as e:
        conn.rollback()
        return jsonify({'error': 'Server error.'}), 500
    finally:
        cur.close()
        conn.close()

@app.route('/api/auth/login', methods=['POST'])
def login():
    ensure_users_table()
    data = request.get_json()
    
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Email and password required.'}), 400
    
    email = data['email']
    password = data['password']
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Get user from database
        cur.execute('SELECT * FROM users WHERE email = %s', (email,))
        user = cur.fetchone()
        
        if not user:
            return jsonify({'error': 'Invalid credentials.'}), 401
        
        # Verify password
        if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            return jsonify({'error': 'Invalid credentials.'}), 401
        
        # Generate JWT token
        token_payload = {
            'email': user['email'],
            'id': str(user['id']),
            'display_name': user['display_name'],
            'is_verified_librarian': user['is_verified_librarian'],
            'reputation': user['reputation'],
            'exp': datetime.utcnow() + timedelta(hours=2)
        }
        
        token = jwt.encode(token_payload, SECRET, algorithm='HS256')
        
        return jsonify({
            'message': 'Login successful',
            'token': token
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Server error.'}), 500
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    app.run(port=5001, debug=True)
