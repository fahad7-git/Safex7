import { useState } from "react";
import axios from "axios";

export default function Scan() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanData, setScanData] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    urlInfo: true,
    domainInfo: false,
    sslInfo: false,
    urlStructure: false,
    securityIndicators: false,
    contentAnalysis: false,
    mlAnalysis: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const scanUrl = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setScanData(null);
    setExpandedSections({
      urlInfo: true,
      domainInfo: false,
      sslInfo: false,
      urlStructure: false,
      securityIndicators: false,
      contentAnalysis: false,
      mlAnalysis: false,
    });

    console.log("==================================================");
    console.log(" SAFEX7 SCANNER - URL DETECTION SYSTEM");
    console.log("==================================================");
    console.log(" URL Being Scanned:", url);
    console.log(" Scan started at:", new Date().toLocaleString());
    console.log("--------------------------------------------------");

    try {
      console.log(" Sending request to backend scanner...");
      
      // For local development, use relative path to leverage the proxy
      // The proxy is configured in package.json to forward to localhost:5000
      // For production, use the REACT_APP_API_URL environment variable
      
      const getBackendUrl = () => {
        // Check for environment variable first (production)
        const envUrl = process.env.REACT_APP_API_URL;
        if (envUrl) {
          console.log(" Using production API URL:", envUrl);
          return envUrl;
        }
        
        // For local development - use relative path to enable proxy
        // The proxy in package.json will forward to localhost:5000
        console.log(" Using proxy (relative path)");
        return "";
      };
      
      const API_BASE = getBackendUrl();
      console.log(" API Base:", API_BASE ? API_BASE : "(proxy)");
      
      // Make request - use relative path for proxy
      const res = await axios.post(`${API_BASE}/scan`, { url });

      console.log(" SCAN COMPLETE - RESULTS RECEIVED");
      console.log("--------------------------------------------------");
      console.log(" URL:", res.data.url || url);
      console.log(" Verdict:", res.data.verdict);
      console.log(" Risk Score:", res.data.risk_score + "%");
      console.log(" Risk Level:", res.data.risk_level);

      if (res.data.confidence) {
        console.log(" ML Confidence:", res.data.confidence + "%");
      }

      console.log("--------------------------------------------------");
      console.log(" DETECTION REASONS / INDICATORS FOUND:");

      if (res.data.reasons && res.data.reasons.length > 0) {
        res.data.reasons.forEach((reason, index) => {
          console.log("   " + (index + 1) + ". " + reason);
        });
      } else {
        console.log("   No suspicious indicators found");
      }

      console.log("--------------------------------------------------");
      console.log(" TECHNICAL DETAILS:");
      console.log("   HTTPS Enabled:", res.data.details?.https_enabled ? "Yes" : "No");
      console.log("   URL Length:", res.data.details?.url_length, "characters");
      console.log("   Domain:", res.data.details?.domain);
      console.log("   TLD:", res.data.details?.tld);
      console.log("   IP-based URL:", res.data.details?.ip_based_url ? "Yes" : "No");

      if (res.data.details?.ml_prediction) {
        console.log("--------------------------------------------------");
        console.log(" ML MODEL ANALYSIS:");
        console.log("   Prediction:", res.data.details.ml_prediction);
        console.log(
          "   ML Confidence:",
          (res.data.details.ml_confidence * 100).toFixed(1) + "%"
        );
      }

      console.log("==================================================");
      console.log(" SCAN FINISHED SUCCESSFULLY");
      console.log("==================================================");

      setScanData(res.data);
    } catch (err) {
      console.log("--------------------------------------------------");
      console.log(" ERROR DURING SCAN");
      console.log("--------------------------------------------------");
      console.log(" Error Message:", err.message);
      console.log(" Error Response:", err.response);
      console.log(" Error Code:", err.code);

      // Determine the error message based on the type of error
      let errorMessage = "An unexpected error occurred. Please try again.";
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        if (isLocalhost) {
          errorMessage = "Cannot connect to backend. Please ensure the Flask server is running on port 5000. Make sure you started it with 'python app.py' in the backend folder.";
        } else {
          errorMessage = "Cannot connect to the scanner service. Please ensure the API is deployed and running.";
        }
      } else if (err.response?.status === 404) {
        errorMessage = "Scanner endpoint not found. Please check the API configuration.";
      } else if (err.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else {
        errorMessage = err.message || "Failed to scan URL. Please try again.";
      }

      setScanData({
        verdict: "Error",
        risk_score: 0,
        risk_level: "Error",
        reasons: [errorMessage],
        details: { error_details: err.message },
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score) => {
    if (score >= 80) return "bg-red-600";
    if (score >= 65) return "bg-red-500";
    if (score >= 45) return "bg-orange-500";
    if (score >= 25) return "bg-yellow-400";
    return "bg-green-500";
  };

  const getRiskBorderColor = (score) => {
    if (score >= 80) return "border-red-600";
    if (score >= 65) return "border-red-500";
    if (score >= 45) return "border-orange-500";
    if (score >= 25) return "border-yellow-400";
    return "border-green-500";
  };

  const getVerdictColor = (level) => {
    switch (level) {
      case "Critical":
        return "text-red-600";
      case "High":
        return "text-red-500";
      case "Medium":
        return "text-orange-500";
      case "Low":
        return "text-yellow-400";
      default:
        return "text-green-500";
    }
  };

  const renderCollapsibleSection = (title, isOpen, onToggle, children) => (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center text-left focus:outline-none"
      >
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <span className={`text-green-400 transition-transform ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>
      {isOpen && <div className="mt-4">{children}</div>}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-green-400 py-8 px-4 md:py-16">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl md:text-5xl font-bold text-center mb-3">
          Deep Threat Scanner
        </h1>

        <p className="text-center text-gray-400 mb-8">
          Advanced AI-Powered Phishing Detection System
        </p>

        <div className="bg-gray-900 p-6 md:p-8 rounded-2xl border border-green-500/30">

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Enter URL to scan..."
              className="flex-1 px-4 py-3 bg-black border border-green-500/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") scanUrl();
              }}
            />

            <button
              onClick={scanUrl}
              disabled={loading}
              className="px-8 py-3 bg-green-500 text-black rounded-lg font-bold hover:bg-green-400 transition disabled:opacity-50"
            >
              {loading ? "Scanning..." : "SCAN"}
            </button>
          </div>

          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          )}

          {scanData && !loading && (
            <div className="mt-8 space-y-4">

              {/* Main Verdict Section */}
              <div className={`bg-gray-800 p-6 rounded-xl border-2 ${getRiskBorderColor(scanData.risk_score)}`}>

                <div className="flex justify-between items-center mb-4">
                  <h2 className={`text-3xl font-bold ${getVerdictColor(scanData.risk_level)}`}>
                    {scanData.verdict}
                  </h2>

                  <span className={`px-4 py-2 rounded-full text-sm font-bold text-white ${getRiskColor(scanData.risk_score)}`}>
                    {scanData.risk_level} Risk
                  </span>
                </div>

                <div className="mb-5">

                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Risk Score</span>
                    <span className="text-white font-bold">
                      {scanData.risk_score}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getRiskColor(scanData.risk_score)}`}
                      style={{ width: scanData.risk_score + "%" }}
                    ></div>
                  </div>

                </div>

                {scanData.summary && (
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-300">{scanData.summary}</p>
                  </div>
                )}
              </div>

              {/* Detection Reasons */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">

                <h3 className="text-xl font-bold text-white mb-4">
                  Detection Reasons ({scanData.reasons?.length || 0})
                </h3>

                <ul className="space-y-2">
                  {scanData.reasons &&
                    scanData.reasons.map((r, i) => (
                      <li key={i} className="flex gap-2 text-gray-300">
                        <span className="text-red-400">•</span>
                        {r}
                      </li>
                    ))}
                </ul>

              </div>

              {/* URL Information Section */}
              {renderCollapsibleSection(
                "🔗 URL Information",
                expandedSections.urlInfo,
                () => toggleSection("urlInfo"),
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Full URL</p>
                    <p className="text-white text-sm break-all">{scanData.details?.domain || "N/A"}</p>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Full Domain</p>
                    <p className="text-white text-sm">{scanData.details?.full_domain || "N/A"}</p>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Subdomain</p>
                    <p className="text-white text-sm">{scanData.details?.subdomain || "None"}</p>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">TLD (Top Level Domain)</p>
                    <p className="text-white text-sm">{scanData.details?.tld || "N/A"}</p>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Path</p>
                    <p className="text-white text-sm break-all">{scanData.details?.path || "/"}</p>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Query String</p>
                    <p className="text-white text-sm break-all">{scanData.details?.query || "None"}</p>
                  </div>
                </div>
              )}

              {/* Domain Information Section */}
              {renderCollapsibleSection(
                "🌐 Domain Information",
                expandedSections.domainInfo,
                () => toggleSection("domainInfo"),
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Domain Age</p>
                    <p className="text-white text-lg font-bold">
                      {scanData.details?.domain_age_days ? (
                        <>
                          {scanData.details.domain_age_days} days
                          {scanData.details.domain_age_days < 30 && (
                            <span className="text-red-400 text-sm ml-2">(NEW!)</span>
                          )}
                        </>
                      ) : (
                        "Unknown"
                      )}
                    </p>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Registrar</p>
                    <p className="text-white text-sm">{scanData.details?.registrar || "Unknown"}</p>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Domain Length</p>
                    <p className="text-white text-sm">{scanData.details?.domain_length || 0} characters</p>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Analysis Timestamp</p>
                    <p className="text-white text-sm">{scanData.details?.analysis_timestamp || "N/A"}</p>
                  </div>
                </div>
              )}

              {/* SSL Certificate Section */}
              {renderCollapsibleSection(
                "🔒 SSL Certificate Analysis",
                expandedSections.sslInfo,
                () => toggleSection("sslInfo"),
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">HTTPS Status</p>
                    <p className={`text-lg font-bold ${scanData.details?.https_enabled ? "text-green-400" : "text-red-400"}`}>
                      {scanData.details?.https_enabled ? "Enabled ✓" : "Not Secure ✗"}
                    </p>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">SSL Issuer</p>
                    <p className="text-white text-sm">{scanData.details?.ssl_issuer || "Unknown"}</p>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Certificate Expiry</p>
                    <p className={`text-lg font-bold ${
                      scanData.details?.ssl_days_until_expiry < 0 ? "text-red-400" :
                      scanData.details?.ssl_days_until_expiry < 30 ? "text-orange-400" : "text-green-400"
                    }`}>
                      {scanData.details?.ssl_days_until_expiry !== undefined 
                        ? (scanData.details.ssl_days_until_expiry < 0 
                            ? `Expired ${Math.abs(scanData.details.ssl_days_until_expiry)} days ago`
                            : `${scanData.details.ssl_days_until_expiry} days remaining`)
                        : "Unknown"}
                    </p>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">SSL Analysis Error</p>
                    <p className="text-gray-500 text-sm">{scanData.details?.ssl_analysis_error || "No errors"}</p>
                  </div>
                </div>
              )}

              {/* URL Structure Section */}
              {renderCollapsibleSection(
                "📊 URL Structure Analysis",
                expandedSections.urlStructure,
                () => toggleSection("urlStructure"),
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">URL Length</p>
                    <p className={`text-lg font-bold ${
                      scanData.details?.url_length > 100 ? "text-red-400" :
                      scanData.details?.url_length > 75 ? "text-orange-400" : "text-green-400"
                    }`}>
                      {scanData.details?.url_length || 0} characters
                    </p>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Subdomain Levels</p>
                    <p className={`text-lg font-bold ${
                      scanData.details?.subdomain_levels > 3 ? "text-red-400" : "text-green-400"
                    }`}>
                      {scanData.details?.subdomain_levels || 0} levels
                    </p>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">IP-Based URL</p>
                    <p className={`text-lg font-bold ${scanData.details?.ip_based_url ? "text-red-400" : "text-green-400"}`}>
                      {scanData.details?.ip_based_url ? "Yes (Suspicious)" : "No"}
                    </p>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Suspicious TLD</p>
                    <p className={`text-lg font-bold ${scanData.details?.suspicious_tld ? "text-red-400" : "text-green-400"}`}>
                      {scanData.details?.suspicious_tld || "No"}
                    </p>
                  </div>
                  {scanData.details?.suspicious_keywords && scanData.details.suspicious_keywords.length > 0 && (
                    <div className="bg-gray-900 p-4 rounded-lg sm:col-span-2">
                      <p className="text-gray-400 text-sm mb-2">Suspicious Keywords Found</p>
                      <div className="flex flex-wrap gap-2">
                        {scanData.details.suspicious_keywords.map((kw, i) => (
                          <span key={i} className="px-3 py-1 bg-red-900/50 text-red-300 rounded-full text-sm">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Security Indicators Section */}
              {renderCollapsibleSection(
                "⚠️ Security Indicators",
                expandedSections.securityIndicators,
                () => toggleSection("securityIndicators"),
                <div className="space-y-3">
                  {scanData.details?.has_at_symbol && (
                    <div className="bg-red-900/30 p-3 rounded-lg flex items-center gap-3">
                      <span className="text-red-400 text-xl">✗</span>
                      <span className="text-white">Contains @ symbol (credential harvesting)</span>
                    </div>
                  )}
                  {scanData.details?.path_manipulation && (
                    <div className="bg-red-900/30 p-3 rounded-lg flex items-center gap-3">
                      <span className="text-red-400 text-xl">✗</span>
                      <span className="text-white">Path manipulation detected (double slashes)</span>
                    </div>
                  )}
                  {scanData.details?.encoded_characters && (
                    <div className="bg-orange-900/30 p-3 rounded-lg flex items-center gap-3">
                      <span className="text-orange-400 text-xl">⚠</span>
                      <span className="text-white">URL contains encoded characters (possible obfuscation)</span>
                    </div>
                  )}
                  {scanData.details?.custom_port && (
                    <div className="bg-orange-900/30 p-3 rounded-lg flex items-center gap-3">
                      <span className="text-orange-400 text-xl">⚠</span>
                      <span className="text-white">Non-standard port detected: {scanData.details.custom_port}</span>
                    </div>
                  )}
                  {scanData.details?.typosquatting_detected && (
                    <div className="bg-red-900/30 p-3 rounded-lg flex items-center gap-3">
                      <span className="text-red-400 text-xl">✗</span>
                      <span className="text-white">Typosquatting detected (fake domain)</span>
                    </div>
                  )}
                  {scanData.details?.homograph_detected && (
                    <div className="bg-red-900/30 p-3 rounded-lg flex items-center gap-3">
                      <span className="text-red-400 text-xl">✗</span>
                      <span className="text-white">Homograph attack detected (non-ASCII characters)</span>
                    </div>
                  )}
                  {scanData.details?.impersonated_brand && (
                    <div className="bg-red-900/30 p-3 rounded-lg flex items-center gap-3">
                      <span className="text-red-400 text-xl">✗</span>
                      <span className="text-white">Brand impersonation: {scanData.details.impersonated_brand}</span>
                    </div>
                  )}
                  {(!scanData.details?.has_at_symbol && 
                    !scanData.details?.path_manipulation && 
                    !scanData.details?.encoded_characters && 
                    !scanData.details?.custom_port && 
                    !scanData.details?.typosquatting_detected && 
                    !scanData.details?.homograph_detected &&
                    !scanData.details?.impersonated_brand) && (
                    <div className="bg-green-900/30 p-3 rounded-lg flex items-center gap-3">
                      <span className="text-green-400 text-xl">✓</span>
                      <span className="text-white">No additional security threats detected</span>
                    </div>
                  )}
                </div>
              )}

              {/* Content Analysis Section */}
              {renderCollapsibleSection(
                "📄 Content Analysis",
                expandedSections.contentAnalysis,
                () => toggleSection("contentAnalysis"),
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">HTTP Status Code</p>
                    <p className={`text-lg font-bold ${
                      scanData.details?.page_status_code >= 400 ? "text-red-400" : "text-green-400"
                    }`}>
                      {scanData.details?.page_status_code || "Unknown"}
                    </p>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Content Length</p>
                    <p className="text-white text-lg font-bold">
                      {scanData.details?.page_content_length 
                        ? `${(scanData.details.page_content_length / 1024).toFixed(2)} KB`
                        : "Unknown"}
                    </p>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Login Form Detected</p>
                    <p className={`text-lg font-bold ${scanData.details?.login_form_detected ? "text-red-400" : "text-green-400"}`}>
                      {scanData.details?.login_form_detected ? "Yes (Suspicious)" : "No"}
                    </p>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Redirect Count</p>
                    <p className={`text-lg font-bold ${
                      scanData.details?.redirect_count > 0 ? "text-orange-400" : "text-green-400"
                    }`}>
                      {scanData.details?.redirect_count || 0} redirects
                    </p>
                  </div>
                  {scanData.details?.final_url && scanData.details.final_url !== scanData.url && (
                    <div className="bg-gray-900 p-4 rounded-lg sm:col-span-2">
                      <p className="text-gray-400 text-sm">Final URL (after redirects)</p>
                      <p className="text-orange-400 text-sm break-all">{scanData.details.final_url}</p>
                    </div>
                  )}
                  {scanData.details?.content_analysis_error && (
                    <div className="bg-gray-900 p-4 rounded-lg sm:col-span-2">
                      <p className="text-gray-400 text-sm">Content Analysis Error</p>
                      <p className="text-gray-500 text-sm">{scanData.details.content_analysis_error}</p>
                    </div>
                  )}
                </div>
              )}

              {/* ML Model Analysis Section */}
              {renderCollapsibleSection(
                "🤖 ML Model Analysis",
                expandedSections.mlAnalysis,
                () => toggleSection("mlAnalysis"),
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-gray-900 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">ML Prediction</p>
                      <p className={`text-lg font-bold ${
                        scanData.details?.ml_prediction === 'phishing' ? "text-red-400" : "text-green-400"
                      }`}>
                        {scanData.details?.ml_prediction 
                          ? scanData.details.ml_prediction.toUpperCase() 
                          : "Not Available"}
                      </p>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">ML Confidence</p>
                      <p className="text-white text-lg font-bold">
                        {scanData.details?.ml_confidence 
                          ? `${(scanData.details.ml_confidence * 100).toFixed(1)}%`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  {scanData.details?.ml_error && (
                    <div className="bg-gray-900 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">ML Error</p>
                      <p className="text-gray-500 text-sm">{scanData.details.ml_error}</p>
                    </div>
                  )}
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Total Checks Performed</p>
                    <p className="text-white text-lg font-bold">
                      {scanData.details?.total_checks_performed || 25} checks
                    </p>
                  </div>
                  
                </div>
              )}

              {/* Raw JSON Data */}
              <details className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                <summary className="cursor-pointer text-green-400 font-bold">
                  📋 View Full Raw JSON Data
                </summary>
                <pre className="mt-4 bg-black p-4 rounded text-xs overflow-auto text-gray-300 max-h-96">
                  {JSON.stringify(scanData, null, 2)}
                </pre>
              </details>

            </div>
          )}

          <div className="text-center mt-10 text-gray-500 text-sm">
            Powered by Safex7 Advanced Threat Detection Engine
          </div>

        </div>
      </div>
    </div>
  );
}

