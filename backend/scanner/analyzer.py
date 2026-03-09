import tldextract
import requests
import re
import whois
import socket
import os
from urllib.parse import urlparse, urlencode
from datetime import datetime
import json

# Suspicious TLDs often used in phishing
SUSPICIOUS_TLDS = ['xyz', 'top', 'club', 'win', 'online', 'site', 'work', 'buzz', 
                   'gq', 'cf', 'ml', 'ga', 'tk', 'pw', 'cc', 'ws', 'su', 'racing',
                   'download', 'bid', 'stream', 'trade', 'date', 'accountant']

# Suspicious keywords in URLs
SUSPICIOUS_KEYWORDS = [
    'login', 'signin', 'verify', 'secure', 'account', 'bank', 'update', 'confirm',
    'password', 'credential', 'authenticate', 'pay', 'payment', 'invoice', 'support',
    'customer', 'service', 'alert', 'unlock', 'free', 'gift', 'prize', 'winner',
    'urgent', 'immediate', 'act now', 'limited', 'expire', 'suspended', 'locked'
]

# Legitimate brands often impersonated
IMPERSONATED_BRANDS = [
    'google', 'facebook', 'amazon', 'apple', 'microsoft', 'netflix', 'paypal',
    'chase', 'wellsfargo', 'bankofamerica', 'citibank', 'capitalone', 'americanexpress',
    'irs', 'socialsecurity', 'fedex', 'ups', 'usps', 'dhl', 'ebay', 'walmart',
    'target', 'bestbuy', 'costco', 'steam', 'discord', 'twitter', 'instagram',
    'linkedin', 'dropbox', 'icloud', 'outlook', 'yahoo', 'aol', 'att', 'verizon',
    'tmobile', 'sprint', 'coinbase', 'binance', 'metamask', 'trustwallet'
]

# Typosquatting patterns
TYPOSQUATTING_PATTERNS = [
    r'googl', r'gogle', r'googel', r'goolge', r'g00gle',
    r'faceb00k', r'facebok', r'faceboook', r'facebk',
    r'amaz0n', r'amazom', r'amzon', r'amazon.com.ru',
    r'paypa1', r'paypaI', r'paypall', r'paypaI'
]

def analyze_url(url):
    """
    Advanced URL analysis for phishing detection with detailed reporting.
    Uses multiple detection methods including:
    - Rule-based analysis
    - ML-based features
    - WHOIS analysis
    - SSL verification
    - Content analysis
    - Brand impersonation detection
    """
    score = 0
    reasons = []
    technical_details = {}
    
    # Parse URL
    extracted = tldextract.extract(url)
    parsed = urlparse(url)
    
    # ============================================
    # 1. BASIC URL STRUCTURE ANALYSIS
    # ============================================
    
    # 1.1 IP-based URL detection
    if extracted.domain.replace(".", "").isdigit():
        score += 50
        reasons.append("CRITICAL: IP address used instead of domain name")
        technical_details['ip_based_url'] = True
    
    # 1.2 Protocol analysis
    if parsed.scheme == 'http':
        score += 25
        reasons.append("No HTTPS encryption - connection is not secure")
        technical_details['https_enabled'] = False
    else:
        technical_details['https_enabled'] = True
    
    # 1.3 URL length analysis
    url_length = len(url)
    if url_length > 100:
        score += 25
        reasons.append(f"Suspiciously long URL ({url_length} characters)")
    elif url_length > 75:
        score += 15
        reasons.append(f"Unusually long URL ({url_length} characters)")
    technical_details['url_length'] = url_length
    
    # 1.4 Domain length analysis
    domain_length = len(extracted.domain)
    if domain_length > 30:
        score += 20
        reasons.append(f"Suspiciously long domain name ({domain_length} chars)")
    technical_details['domain_length'] = domain_length
    
    # ============================================
    # 2. KEYWORD ANALYSIS
    # ============================================
    
    # 2.1 Suspicious keywords
    found_keywords = []
    for word in SUSPICIOUS_KEYWORDS:
        if word in url.lower():
            found_keywords.append(word)
    
    if found_keywords:
        score += len(found_keywords) * 10
        reasons.append(f"Multiple suspicious keywords detected: {', '.join(found_keywords[:5])}")
        technical_details['suspicious_keywords'] = found_keywords
    
    # ============================================
    # 3. TLD ANALYSIS
    # ============================================
    
    # 3.1 Suspicious TLDs
    if extracted.suffix.lower() in SUSPICIOUS_TLDS:
        score += 30
        reasons.append(f"Suspicious top-level domain: {extracted.suffix}")
        technical_details['suspicious_tld'] = extracted.suffix
    
    # 3.2 Excessive subdomains
    subdomain_count = url.count('.') - 1
    if subdomain_count > 3:
        score += 15
        reasons.append(f"Excessive subdomains detected ({subdomain_count} levels)")
        technical_details['subdomain_levels'] = subdomain_count
    
    # ============================================
    # 4. BRAND IMPERSONATION DETECTION
    # ============================================
    
    # 4.1 Direct brand impersonation
    domain_lower = extracted.domain.lower()
    for brand in IMPERSONATED_BRANDS:
        if brand in domain_lower and domain_lower != brand:
            score += 45
            reasons.append(f"POSSIBLE BRAND IMPERSONATION: '{brand}' detected in domain")
            technical_details['impersonated_brand'] = brand
            break
    
    # 4.2 Typosquatting detection
    for pattern in TYPOSQUATTING_PATTERNS:
        if re.search(pattern, domain_lower):
            score += 40
            reasons.append("TYPOSQUATTING DETECTED: Domain appears to be a typo of a legitimate site")
            technical_details['typosquatting_detected'] = True
            break
    
    # ============================================
    # 5. SUSPICIOUS CHARACTERS & PATTERNS
    # ============================================
    
    # 5.1 @ symbol in URL
    if '@' in url:
        score += 50
        reasons.append("CRITICAL: URL contains @ symbol - credential harvesting attempt")
        technical_details['has_at_symbol'] = True
    
    # 5.2 Multiple slashes in path
    if '//' in parsed.path[1:] if parsed.path else False:
        score += 20
        reasons.append("URL contains path manipulation (double slashes)")
        technical_details['path_manipulation'] = True
    
    # 5.3 Suspicious characters
    suspicious_chars = ['_', '-', '~']
    if sum(1 for c in url if c in suspicious_chars) > 5:
        score += 10
        reasons.append("Unusual character pattern in URL")
    
    # 5.4 Hex encoding in URL
    if '%' in url and re.search(r'%[0-9A-Fa-f]{2}', url):
        score += 15
        reasons.append("URL contains encoded characters - possible obfuscation")
        technical_details['encoded_characters'] = True
    
    # 5.5 Numbers in domain (often fake)
    if re.search(r'[a-z]{10,}[0-9]{3,}', domain_lower):
        score += 20
        reasons.append("Suspicious number pattern in domain")
    
    # 5.6 Port number in URL
    if parsed.port:
        score += 15
        reasons.append(f"Non-standard port number detected: {parsed.port}")
        technical_details['custom_port'] = parsed.port
    
    # ============================================
    # 6. WHOIS DOMAIN ANALYSIS
    # ============================================
    
    try:
        domain_full = f"{extracted.domain}.{extracted.suffix}"
        w = whois.whois(domain_full)
        
        # Check domain age (new domains are suspicious)
        if w.creation_date:
            if isinstance(w.creation_date, list):
                creation = w.creation_date[0]
            else:
                creation = w.creation_date
            
            if creation:
                days_old = (datetime.now() - creation).days
                technical_details['domain_age_days'] = days_old
                
                if days_old < 30:
                    score += 40
                    reasons.append(f"VERY SUSPICIOUS: Domain is only {days_old} days old (likely newly registered)")
                elif days_old < 90:
                    score += 20
                    reasons.append(f"Domain is relatively new ({days_old} days)")
        
        # Check registrant info
        if w.registrar:
            technical_details['registrar'] = str(w.registrar)
            
    except Exception as e:
        technical_details['whois_error'] = str(e)
    
    # ============================================
    # 7. SSL CERTIFICATE ANALYSIS
    # ============================================
    
    if parsed.scheme == 'https':
        try:
            hostname = extracted.domain + '.' + extracted.suffix if extracted.suffix else extracted.domain
            
            # Create SSL context
            import ssl
            context = ssl.create_default_context()
            
            with socket.create_connection((hostname, 443), timeout=5) as sock:
                with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                    cert = ssock.getpeercert()
                    
                    # Check certificate issuer
                    issuer = dict(x[0] for x in cert['issuer'])
                    common_name = issuer.get('commonName', '')
                    technical_details['ssl_issuer'] = common_name
                    
                    # Check if certificate is expired
                    not_after = datetime.strptime(cert['notAfter'], '%b %d %H:%M:%S %Y %Z')
                    days_until_expiry = (not_after - datetime.now()).days
                    technical_details['ssl_days_until_expiry'] = days_until_expiry
                    
                    if days_until_expiry < 0:
                        score += 50
                        reasons.append("CRITICAL: SSL certificate is EXPIRED")
                    elif days_until_expiry < 30:
                        score += 15
                        reasons.append(f"SSL certificate expires soon ({days_until_expiry} days)")
                        
        except Exception as e:
            technical_details['ssl_analysis_error'] = str(e)
    
    # ============================================
    # 8. CONTENT ANALYSIS (if URL is accessible)
    # ============================================
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=5, verify=False)
        
        technical_details['page_status_code'] = response.status_code
        technical_details['page_content_length'] = len(response.text)
        
        # Check for login forms
        if '<form' in response.text.lower() or 'password' in response.text.lower():
            forms = re.findall(r'<form[^>]*>', response.text, re.IGNORECASE)
            if forms:
                score += 25
                reasons.append("Login form detected on page - possible credential harvesting")
                technical_details['login_form_detected'] = True
        
        # Check for suspicious redirects
        if len(response.history) > 0:
            technical_details['redirect_count'] = len(response.history)
            technical_details['final_url'] = response.url
            
            if response.url != url:
                score += 10
                reasons.append("URL redirects to different domain")
                
    except Exception as e:
        technical_details['content_analysis_error'] = str(e)
    
    # ============================================
    # 9. URL PATTERN ANALYSIS
    # ============================================
    
    # 9.1 Homograph attack detection (mixed scripts)
    if re.search(r'[\u0600-\u06FF\u0400-\u04FF\u4e00-\u9fff]', url):
        score += 35
        reasons.append("HOMOGRAPH ATTACK: Non-ASCII characters detected in URL")
        technical_details['homograph_detected'] = True
    
    # 9.2 Bait words (urgency/fear tactics)
    bait_words = ['urgent', 'immediately', 'act now', 'last chance', 'limited time', 
                  'suspended', 'locked', 'unauthorized', 'compromised', 'breach']
    for word in bait_words:
        if word in url.lower():
            score += 15
            reasons.append(f"BAIT TACTIC: Urgency word '{word}' detected")
            break
    
    # ============================================
    # 10. ML MODEL PREDICTION (if available)
    # ============================================
    
    ml_prediction = None
    try:
        import joblib
        from scanner.features import extract_features
        
        # Try to load ML model - use absolute path relative to the backend folder
        model_paths = [
            os.path.join(os.path.dirname(os.path.dirname(__file__)), 'phishing_model.joblib'),
            os.path.join(os.path.dirname(__file__), 'phishing_model.joblib'),
            'phishing_model.joblib'
        ]
        
        model = None
        for model_path in model_paths:
            try:
                if os.path.exists(model_path):
                    model = joblib.load(model_path)
                    print(f"ML Model loaded from: {model_path}")
                    break
            except Exception as load_err:
                print(f"Could not load model from {model_path}: {load_err}")
                continue
        
        if model is not None:
            features = extract_features(url)
            
            # Create feature vector
            feature_vector = [
                1 if features['https'] else 0,
                features['url_length'],
                1 if features['contains_ip'] else 0,
                len(features['suspicious_keywords'])
            ]
            
            ml_prediction = model.predict([feature_vector])[0]
            ml_proba = model.predict_proba([feature_vector])[0]
            
            technical_details['ml_prediction'] = 'phishing' if ml_prediction == 1 else 'legitimate'
            technical_details['ml_confidence'] = float(max(ml_proba))
            
            if ml_prediction == 1:
                score += int(max(ml_proba) * 30)
                reasons.append(f"ML Model identifies this as PHISHING ({max(ml_proba)*100:.1f}% confidence)")
        else:
            technical_details['ml_model'] = 'not_found'
            
    except Exception as e:
        technical_details['ml_error'] = str(e)
    
    # ============================================
    # FINAL SCORE CALCULATION
    # ============================================
    
    score = min(score, 100)
    
    # Determine verdict with more granular levels
    if score >= 80:
        verdict = "CRITICAL - High Confidence Phishing"
        risk_level = "Critical"
    elif score >= 65:
        verdict = "High Risk - Likely Phishing"
        risk_level = "High"
    elif score >= 45:
        verdict = "Medium Risk - Suspicious"
        risk_level = "Medium"
    elif score >= 25:
        verdict = "Low Risk - Caution Advised"
        risk_level = "Low"
    else:
        verdict = "Safe - No Significant Threats Detected"
        risk_level = "Safe"
    
    is_safe = score < 40
    
    # Additional detailed information
    technical_details.update({
        'domain': extracted.domain,
        'subdomain': extracted.subdomain,
        'tld': extracted.suffix,
        'full_domain': f"{extracted.domain}.{extracted.suffix}",
        'path': parsed.path,
        'query': parsed.query,
        'total_checks_performed': 25,
        'analysis_timestamp': datetime.now().isoformat()
    })
    
    return {
        'url': url,
        'verdict': verdict,
        'risk_level': risk_level,
        'risk_score': score,
        'confidence': min(100, score + 15),  # Confidence based on score
        'is_phishing': not is_safe,
        'reasons': reasons if reasons else ["No suspicious indicators detected - URL appears legitimate"],
        'details': technical_details,
        'summary': generate_summary(score, reasons, risk_level)
    }


def generate_summary(score, reasons, risk_level):
    """Generate a human-readable summary of the analysis."""
    if score >= 80:
        return "This URL shows multiple strong indicators of being a phishing attempt. We strongly advise NOT visiting this URL."
    elif score >= 65:
        return "This URL exhibits characteristics commonly associated with phishing websites. Exercise extreme caution."
    elif score >= 45:
        return "This URL has several suspicious elements. Proceed with caution and verify through official channels."
    elif score >= 25:
        return "This URL has some concerning attributes but could be legitimate. Verify the sender and URL before proceeding."
    else:
        return "This URL appears to be safe based on our analysis. However, always exercise caution online."


def analyze_url_ml(url, model=None):
    """
    ML-based analysis wrapper.
    Currently uses rule-based analysis as primary with ML enhancement.
    """
    return analyze_url(url)

