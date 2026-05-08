document.addEventListener('DOMContentLoaded', () => {
  const urlInput = document.getElementById('url-input');
  const scanBtn = document.getElementById('scan-btn');
  const resultsPanel = document.getElementById('results-panel');
  const checkList = document.getElementById('check-list');
  const summaryText = document.getElementById('summary-text');
  const actionText = document.getElementById('action-text');
  const riskBadge = document.getElementById('risk-badge');
  const resetBtn = document.getElementById('reset-btn');

  const suspiciousKeywords = ['login', 'verify', 'free', 'account', 'secure', 'update', 'banking', 'auth'];
  
  function scanURL(url) {
    let score = 0; // Higher score = higher risk
    const checks = [];
    
    // 1. HTTPS Check
    if (url.startsWith('https://')) {
      checks.push({ name: "HTTPS protocol detected", pass: true });
    } else {
      checks.push({ name: "Not using HTTPS (Insecure)", pass: false });
      score += 2;
    }

    // Extract domain and path
    let domain = "";
    let path = "";
    try {
      const parsedUrl = new URL(url.startsWith('http') ? url : `http://${url}`);
      domain = parsedUrl.hostname;
      path = parsedUrl.pathname;
    } catch (e) {
      domain = url;
    }

    // 2. Suspicious Keywords
    const foundKeywords = suspiciousKeywords.filter(kw => url.toLowerCase().includes(kw));
    if (foundKeywords.length > 0) {
      checks.push({ name: `Suspicious keywords found: ${foundKeywords.join(', ')}`, pass: false });
      score += foundKeywords.length;
    } else {
      checks.push({ name: "No suspicious keywords detected", pass: true });
    }

    // 3. Excessive Subdomains
    const domainParts = domain.split('.');
    if (domainParts.length > 3 && !domain.includes('co.uk')) {
      checks.push({ name: "Excessive subdomains (potential cloaking)", pass: false });
      score += 2;
    } else {
      checks.push({ name: "Normal subdomain structure", pass: true });
    }

    // 4. Lookalike Characters (Homoglyphs)
    // Simple simulation: looking for numbers substituting letters like 1 for l/i, 0 for o
    if (/[01]/.test(domain) && /[a-z]/i.test(domain)) {
      checks.push({ name: "Lookalike characters detected in domain (e.g. 'paypa1.com')", pass: false });
      score += 2;
    } else {
      checks.push({ name: "No obvious lookalike characters", pass: true });
    }

    // 5. URL Length
    if (url.length > 75) {
      checks.push({ name: "URL is excessively long (often used to hide real domain)", pass: false });
      score += 1;
    } else {
      checks.push({ name: "URL length is normal", pass: true });
    }
    
    // Determine Risk Level
    let riskLevel = 'Safe';
    if (score >= 4) riskLevel = 'Dangerous';
    else if (score >= 2) riskLevel = 'Suspicious';

    let summary = '';
    let action = '';

    if (riskLevel === 'Dangerous') {
      summary = `We found multiple severe red flags. This URL exhibits behaviors highly consistent with phishing or malware distribution.`;
      action = `Do not click or visit this link. Delete the message containing it immediately.`;
    } else if (riskLevel === 'Suspicious') {
      summary = `We found some irregular patterns. While not definitively malicious, it requires caution.`;
      action = `Verify the sender before clicking. If it claims to be a service you use, type the official address into your browser manually instead of using this link.`;
    } else {
      summary = `The URL passed our basic heuristic checks. No common malicious patterns were detected.`;
      action = `It appears safe, but always remain vigilant. Ensure the site looks correct before entering passwords.`;
    }

    return { riskLevel, checks, summary, action };
  }

  scanBtn.addEventListener('click', () => {
    const url = urlInput.value.trim();
    if (!url) return;

    const result = scanURL(url);
    
    // Update Badge
    riskBadge.className = 'risk-badge';
    riskBadge.textContent = result.riskLevel;
    if (result.riskLevel === 'Safe') riskBadge.classList.add('badge-safe');
    if (result.riskLevel === 'Suspicious') riskBadge.classList.add('badge-suspicious');
    if (result.riskLevel === 'Dangerous') riskBadge.classList.add('badge-dangerous');
    
    // Update checks
    checkList.innerHTML = '';
    result.checks.forEach(c => {
      const icon = c.pass ? '<span class="check-icon icon-pass">✓</span>' : '<span class="check-icon icon-fail">✕</span>';
      checkList.innerHTML += `<li class="check-item">${icon} ${c.name}</li>`;
    });
    
    // Update Text
    summaryText.textContent = result.summary;
    actionText.textContent = result.action;
    
    // Reveal panel smoothly
    resultsPanel.style.maxHeight = '800px';
  });

  resetBtn.addEventListener('click', () => {
    resultsPanel.style.maxHeight = '0';
    setTimeout(() => {
      urlInput.value = '';
    }, 500);
  });
});
