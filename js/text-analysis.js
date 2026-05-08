document.addEventListener('DOMContentLoaded', () => {
  const textInput = document.getElementById('text-input');
  const analyzeBtn = document.getElementById('analyze-btn');
  const resultsPanel = document.getElementById('results-panel');
  const scoreDisplay = document.getElementById('score-display');
  const scoreFill = document.getElementById('score-fill');
  const verdictTitle = document.getElementById('verdict-title');
  const verdictExplanation = document.getElementById('verdict-explanation');
  const resetBtn = document.getElementById('reset-btn');

  // Flag Elements
  const flags = {
    emotional: document.getElementById('flag-emotional'),
    absolute: document.getElementById('flag-absolute'),
    urgency: document.getElementById('flag-urgency'),
    conspiracy: document.getElementById('flag-conspiracy'),
    neutral: document.getElementById('flag-neutral'),
    hedged: document.getElementById('flag-hedged')
  };

  // Keyword Dictionaries
  const dict = {
    emotional: ['shocking', 'outrage', 'destroyed', 'furious', 'evil', 'disgusting', 'horrific', 'miracle', 'mind-blowing'],
    absolute: ['always', 'never', 'everyone', 'no one', 'nobody', 'everybody', 'impossible', '100% proof'],
    urgency: ['act now', 'before it\'s too late', 'share immediately', 'urgent', 'read this before it\'s deleted', 'hurry'],
    conspiracy: ['they don\'t want you to know', 'cover-up', 'exposed', 'truth revealed', 'hidden agenda', 'deep state', 'sheeple'],
    neutral: ['announced', 'stated', 'reported', 'measured', 'observed', 'according to data', 'statistics show'],
    hedged: ['experts say', 'reportedly', 'may indicate', 'suggests', 'likely', 'could potentially', 'it appears']
  };

  function analyzeText(text) {
    const lowerText = text.toLowerCase();
    let score = 100;
    const activeFlags = [];

    // Check each category
    let foundEmotional = false;
    let foundAbsolute = false;
    let foundUrgency = false;
    let foundConspiracy = false;
    let foundNeutral = false;
    let foundHedged = false;

    dict.emotional.forEach(kw => { if(lowerText.includes(kw)) { foundEmotional = true; score -= 15; }});
    dict.absolute.forEach(kw => { if(lowerText.includes(kw)) { foundAbsolute = true; score -= 10; }});
    dict.urgency.forEach(kw => { if(lowerText.includes(kw)) { foundUrgency = true; score -= 15; }});
    dict.conspiracy.forEach(kw => { if(lowerText.includes(kw)) { foundConspiracy = true; score -= 25; }});
    
    dict.neutral.forEach(kw => { if(lowerText.includes(kw)) { foundNeutral = true; score += 10; }});
    dict.hedged.forEach(kw => { if(lowerText.includes(kw)) { foundHedged = true; score += 10; }});

    // Cap score between 0 and 100
    score = Math.max(0, Math.min(100, score));

    if(foundEmotional) activeFlags.push('emotional');
    if(foundAbsolute) activeFlags.push('absolute');
    if(foundUrgency) activeFlags.push('urgency');
    if(foundConspiracy) activeFlags.push('conspiracy');
    if(foundNeutral) activeFlags.push('neutral');
    if(foundHedged) activeFlags.push('hedged');

    let verdict = 'Likely Credible';
    let explanation = 'The text uses mostly neutral or hedged language without obvious manipulation tactics.';
    let color = '#2ecc71';

    if (score < 40) {
      verdict = 'Likely Misleading';
      explanation = 'High concentration of sensationalism, urgency, or conspiracy language. Approach with extreme skepticism.';
      color = '#e74c3c';
    } else if (score < 75) {
      verdict = 'Needs Verification';
      explanation = 'Contains some emotional or absolute language. Verify the claims with independent sources.';
      color = '#f1c40f';
    }

    return { score, activeFlags, verdict, explanation, color };
  }

  analyzeBtn.addEventListener('click', () => {
    const text = textInput.value.trim();
    if (!text) return;

    const result = analyzeText(text);

    // Reset flags
    Object.values(flags).forEach(el => el.className = 'flag-tag');

    // Activate flags
    result.activeFlags.forEach(f => {
      if(f === 'emotional' || f === 'absolute') flags[f].classList.add('active-red');
      if(f === 'urgency' || f === 'conspiracy') flags[f].classList.add('active-yellow');
      if(f === 'neutral' || f === 'hedged') flags[f].classList.add('active-green');
    });

    // Update Verdict
    verdictTitle.textContent = result.verdict;
    verdictTitle.style.color = result.color;
    verdictExplanation.textContent = result.explanation;

    // Reveal Panel
    resultsPanel.style.maxHeight = '800px';

    // Animate Score
    setTimeout(() => {
      scoreDisplay.textContent = result.score + '%';
      scoreFill.style.width = result.score + '%';
      scoreFill.style.backgroundColor = result.color;
    }, 100);
  });

  resetBtn.addEventListener('click', () => {
    resultsPanel.style.maxHeight = '0';
    scoreFill.style.width = '0%';
    setTimeout(() => {
      textInput.value = '';
    }, 500);
  });
});
