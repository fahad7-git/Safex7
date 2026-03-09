import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from scanner.analyzer import analyze_url

app = Flask(__name__)

# Enable CORS for ALL routes - more permissive for development
CORS(app, 
     resources={
         r"/*": {
             "origins": "*",
             "methods": ["GET", "POST", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization"]
         }
     },
     supports_credentials=False)

# Get the directory paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Look for frontend build in parent directory (backend/ is subdirectory of project root)
FRONTEND_BUILD = os.path.join(BASE_DIR, '..', 'frontend', 'build')
# Also check current directory structure
if not os.path.exists(FRONTEND_BUILD):
    FRONTEND_BUILD = os.path.join(BASE_DIR, 'frontend', 'build')

@app.route("/scan", methods=["POST", "OPTIONS"])
@app.route("/api/scan", methods=["POST", "OPTIONS"])
def scan():
    """
    Endpoint to scan a URL for phishing indicators.
    Expects JSON: {"url": "https://example.com"}
    Returns: verdict, risk_score, reasons, details
    """
    try:
        data = request.get_json()
        
        if not data or "url" not in data:
            return jsonify({
                "verdict": "Error",
                "risk_score": 0,
                "reasons": ["No URL provided"],
                "details": {"error": "Please provide a URL to scan"}
            }), 400
        
        url = data.get("url", "").strip()
        
        if not url:
            return jsonify({
                "verdict": "Error",
                "risk_score": 0,
                "reasons": ["Empty URL provided"],
                "details": {"error": "Please provide a valid URL"}
            }), 400
        
        # Add https:// if no protocol specified
        if not url.startswith(("http://", "https://")):
            url = "https://" + url
        
        # Perform the actual analysis
        result = analyze_url(url)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "verdict": "Error",
            "risk_score": 0,
            "reasons": [f"Analysis failed: {str(e)}"],
            "details": {"error": str(e)}
        }), 500

@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "Safex7 Scanner"})

# Serve static files from React build
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_spa(path):
    """Serve the React app for all routes (SPA fallback)"""
    # First try to serve the file directly
    if path and os.path.exists(os.path.join(FRONTEND_BUILD, path)):
        return send_from_directory(FRONTEND_BUILD, path)
    
    # Otherwise serve index.html (for SPA routing)
    return send_from_directory(FRONTEND_BUILD, 'index.html')

if __name__ == "__main__":
    app.run(debug=True, port=5000, host='0.0.0.0')

