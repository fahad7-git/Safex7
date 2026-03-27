import re
from urllib.parse import urlparse

def extract_features(url):
    parsed = urlparse(url)

    return {
        "https": parsed.scheme == "https",
        "url_length": len(url),
        "contains_ip": bool(re.search(r"\\d+\\.\\d+\\.\\d+\\.\\d+", url)),
        "suspicious_keywords": [
            k for k in ["login", "secure", "verify", "account", "bank"]
            if k in url.lower()
        ]
    }
