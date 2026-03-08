from flask import Flask, request, jsonify
from flask_cors import CORS
from scanner.analyzer import analyze_url

app = Flask(__name__)
CORS(app)

@app.route("/scan", methods=["POST"])
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

if __name__ == "__main__":
    app.run(debug=True, port=5000)

