document.addEventListener('DOMContentLoaded', () => {
  const tags = document.querySelectorAll('.interest-tag');
  const generateBtn = document.getElementById('generate-feed-btn');
  const feedSection = document.getElementById('feed-section');
  const feedContainer = document.getElementById('feed-container');
  const revealBtn = document.getElementById('reveal-btn');
  const explanationPanel = document.getElementById('explanation-panel');
  const explanationText = document.getElementById('explanation-text');
  
  let selectedTopics = [];
  
  // Content Database
  const contentDB = {
    Sports: [
      { headline: "Local Team Wins Championship in Stunning Overtime", source: "SportsDaily", likes: "12K", isMisleading: false },
      { headline: "REFEREE BRIBED? Leaked audio suggests finals were rigged!", source: "SportsOutrage.net", likes: "89K", isMisleading: true }
    ],
    Politics: [
      { headline: "Senate Passes New Infrastructure Bill", source: "Capitol News", likes: "4K", isMisleading: false },
      { headline: "SENATOR EXPOSED: You won't believe what they voted for!", source: "PatriotTruth", likes: "150K", isMisleading: true }
    ],
    Health: [
      { headline: "New Study Shows Benefits of 8 Hours of Sleep", source: "HealthJournal", likes: "3K", isMisleading: false },
      { headline: "DOCTORS HATE THIS: The secret cure for all diseases hidden by Big Pharma!", source: "NaturalAwakening", likes: "210K", isMisleading: true }
    ],
    Technology: [
      { headline: "New Smartphone Model Released with Better Battery", source: "TechInsider", likes: "9K", isMisleading: false },
      { headline: "WARNING: Your Phone is Recording Everything You Say Right Now!", source: "CyberFear", likes: "115K", isMisleading: true }
    ],
    Entertainment: [
      { headline: "Award Show Returns to Normal Schedule Next Year", source: "HollywoodReporter", likes: "5K", isMisleading: false },
      { headline: "HOLLYWOOD ELITE: The dark secret behind the latest blockbuster!", source: "CelebGossip.tv", likes: "95K", isMisleading: true }
    ],
    Science: [
      { headline: "Astronomers Discover New Exoplanet in Habitable Zone", source: "ScienceWeekly", likes: "14K", isMisleading: false },
      { headline: "NASA COVERUP: Approaching Asteroid will hit Earth next month!", source: "CosmicTruth", likes: "105K", isMisleading: true }
    ],
    Finance: [
      { headline: "Markets Close Slightly Higher After Jobs Report", source: "FinancialTimes", likes: "2K", isMisleading: false },
      { headline: "MARKET CRASH IMMINENT: Withdraw all your money NOW!", source: "WealthProtector", likes: "180K", isMisleading: true }
    ],
    Travel: [
      { headline: "Top 10 Destinations for Summer 2026", source: "TravelGuide", likes: "8K", isMisleading: false },
      { headline: "NEVER FLY AGAIN: The terrifying secret airlines are hiding from you!", source: "FlightRisk.com", likes: "135K", isMisleading: true }
    ],
    Fashion: [
      { headline: "Spring Collection Debuts at Paris Fashion Week", source: "StyleMagazine", likes: "11K", isMisleading: false },
      { headline: "TOXIC CLOTHES: The popular brand that is poisoning your skin!", source: "EcoWarrior", likes: "120K", isMisleading: true }
    ]
  };

  // Tag Selection Logic
  tags.forEach(tag => {
    tag.addEventListener('click', () => {
      const topic = tag.getAttribute('data-topic');
      
      if (tag.classList.contains('selected')) {
        tag.classList.remove('selected');
        selectedTopics = selectedTopics.filter(t => t !== topic);
      } else {
        if (selectedTopics.length < 3) {
          tag.classList.add('selected');
          selectedTopics.push(topic);
        }
      }
      
      if (selectedTopics.length === 3) {
        generateBtn.disabled = false;
      } else {
        generateBtn.disabled = true;
      }
    });
  });
  
  // Generate Feed
  generateBtn.addEventListener('click', () => {
    feedContainer.innerHTML = ''; // clear previous
    let feedItems = [];
    
    // Pick 2 items from each of the 3 selected topics
    selectedTopics.forEach(topic => {
      feedItems = feedItems.concat(contentDB[topic]);
    });
    
    // Shuffle feed items
    feedItems = feedItems.sort(() => Math.random() - 0.5);
    
    // Render
    feedItems.forEach(item => {
      const card = document.createElement('div');
      card.className = 'feed-card';
      if(item.isMisleading) card.classList.add('misleading-item');
      
      card.innerHTML = `
        <div class="flagged-warning">⚠ This content was flagged as potentially misleading.</div>
        <h4 style="font-size:18px; margin-bottom:10px;">${item.headline}</h4>
        <div style="font-size:14px; font-weight:bold;">${item.source}</div>
        <div class="feed-meta">
          <span>❤️ ${item.likes} Likes</span>
          <span>🔄 Share</span>
        </div>
      `;
      feedContainer.appendChild(card);
    });
    
    // Show feed section
    feedSection.style.display = 'block';
    
    // Scroll to feed
    feedSection.scrollIntoView({ behavior: 'smooth' });
    
    // Reset reveal state
    explanationPanel.style.display = 'none';
    revealBtn.style.display = 'inline-block';
    document.querySelectorAll('.misleading-item').forEach(el => el.classList.remove('revealed'));
  });
  
  // Reveal Logic
  revealBtn.addEventListener('click', () => {
    document.querySelectorAll('.misleading-item').forEach(el => {
      el.classList.add('revealed');
    });
    
    const topicsStr = selectedTopics.join(', ');
    explanationText.innerHTML = `Because you selected <strong>${topicsStr}</strong>, the algorithm prioritized content matching those interests. Notice how the misleading content has drastically more 'Likes' than the factual content? Algorithms boost sensational, emotional posts because they keep users clicking and scrolling.`;
    
    explanationPanel.style.display = 'block';
    revealBtn.style.display = 'none';
  });
});
