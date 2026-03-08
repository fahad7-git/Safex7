def rule_based_score(features):
    score = 0
    reasons = []

    if not features["https"]:
        score += 25
        reasons.append("No HTTPS encryption")

    if features["contains_ip"]:
        score += 30
        reasons.append("IP address used instead of domain")

    if features["url_length"] > 30:
        score += 15
        reasons.append("Long URL length")

    if features["suspicious_keywords"]:
        score += 25
        reasons.append("Suspicious keywords detected")

    return min(score, 100), reasons
