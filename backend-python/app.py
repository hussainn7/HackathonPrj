import os
import json
from flask import Flask, request, jsonify
import google.generativeai as genai
from pdfminer.high_level import extract_text
from werkzeug.utils import secure_filename
from flask_cors import CORS

genai.configure(api_key="AIzaSyCSqscxiqlJ9VKMX59P65tq-Meatj3-zno")
model = genai.GenerativeModel("gemini-1.5-flash")

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
CORS(app)

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

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

if __name__ == '__main__':
    app.run(port=5001, debug=True)
