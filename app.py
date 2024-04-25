import io
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename

from pdfReader import summarize_pdf

app = Flask(__name__)

@app.route('/data', methods=['POST'])
def process_data():
    # Check if a file is in the request
    if 'file' not in request.files:
        return jsonify({"message": "No file part in the request"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400
    
    filename = secure_filename(file.filename)
    file_stream = io.BytesIO(file.read())

    # Call the summarize_pdf function from pdf.py
    summary = summarize_pdf(file_stream)
    
    # For now, just return a confirmation response
    return jsonify({"message": "File received", "filename": summary}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
