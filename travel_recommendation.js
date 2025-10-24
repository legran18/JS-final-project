let isDataLoaded = false;

async function fetchRecommendations() {
  try {
    const response = await fetch('travel_recommendation_api.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    
    // PROCESSAMENTO ESPECÍFICO para sua estrutura JSON
    const allPlaces = [];
    data.countries.forEach(country => allPlaces.push(...country.cities));
    allPlaces.push(...data.temples);
    allPlaces.push(...data.beaches);
    
    window.recommendationData = allPlaces; // Agora sim existe
    isDataLoaded = true;
    console.log('Data loaded successfully! Total items:', window.recommendationData.length);

    // Criar container inicial
    const resultsContainer = document.getElementById('recommendationResults') || document.createElement('div');
    resultsContainer.id = 'recommendationResults';
    resultsContainer.style.display = 'flex';
    resultsContainer.style.flexWrap = 'wrap';
    resultsContainer.style.gap = '20px';
    resultsContainer.style.marginTop = '30px';
    
    if (!document.getElementById('recommendationResults')) {
      document.body.appendChild(resultsContainer);
    }

  } catch (error) {
    console.error('Error fetching recommendations:', error);
    
    const resultsContainer = document.getElementById('recommendationResults') || document.createElement('div');
    resultsContainer.id = 'recommendationResults';
    resultsContainer.innerHTML = '<p>Error loading data. Please refresh the page.</p>';
    document.body.appendChild(resultsContainer);
  }
}

function normalizeKeyword(keyword) {
  keyword = keyword.toLowerCase();
  if (keyword.includes('beach') || keyword.includes('beaches')) return 'beach';
  if (keyword.includes('temple') || keyword.includes('temples')) return 'temple';
  if (keyword.includes('country') || keyword.includes('countries')) return 'country';
  if (keyword.includes('city') || keyword.includes('cities')) return 'city';
  if (keyword.includes('australia')) return 'australia';
  if (keyword.includes('japan')) return 'japan';
  if (keyword.includes('brazil')) return 'brazil';
  return keyword;
}

function search() {
  if (!isDataLoaded || !window.recommendationData) {
    console.log('Data not loaded yet. Please wait a moment and try again.');
    
    const resultsContainer = document.getElementById('recommendationResults') || document.createElement('div');
    resultsContainer.id = 'recommendationResults';
    resultsContainer.innerHTML = '<p>Data still loading. Please wait a moment...</p>';
    
    if (!document.getElementById('recommendationResults')) {
      document.body.appendChild(resultsContainer);
    }
    return;
  }

  const query = document.getElementById('searchInput').value.toLowerCase();
  const normalizedQuery = normalizeKeyword(query);
  console.log('Searching for:', query, 'Normalized:', normalizedQuery);

  const resultsContainer = document.getElementById('recommendationResults') || document.createElement('div');
  resultsContainer.id = 'recommendationResults';
  resultsContainer.innerHTML = ''; // Clear previous results
  resultsContainer.style.display = 'flex';
  resultsContainer.style.flexWrap = 'wrap';
  resultsContainer.style.gap = '20px';
  resultsContainer.style.marginTop = '30px';
  
  if (!document.getElementById('recommendationResults')) {
    document.body.appendChild(resultsContainer);
  }

  const filtered = window.recommendationData.filter(place => {
    const name = place.name.toLowerCase();
    const description = place.description.toLowerCase();
    const matches = name.includes(normalizedQuery) || description.includes(normalizedQuery);
    console.log('Checking:', place.name, 'Matches:', matches);
    return matches;
  });

  console.log('Filtered results:', filtered.length, filtered);

  if (filtered.length === 0) {
    resultsContainer.innerHTML = `<p>No results found for "${query}". Try: beach, temple, australia, japan, brazil</p>`;
    return;
  }

  filtered.forEach(place => {
    const card = document.createElement('div');
    card.style.border = '1px solid #ccc';
    card.style.padding = '15px';
    card.style.width = '300px';
    card.style.borderRadius = '8px';
    card.style.backgroundColor = '#fff';
    card.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';

    // CORREÇÃO: Usar tag img para as URLs de imagem
    const imageHtml = place.imageUrl ? 
      `<img src="${place.imageUrl}" alt="${place.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 4px; margin-bottom: 10px;">` : 
      '<p>No image available</p>';

    card.innerHTML = `
      <h3>${place.name}</h3>
      ${imageHtml}
      <p>${place.description}</p>
    `;
    resultsContainer.appendChild(card);
  });
}

function resetSearch() {
  document.getElementById('searchInput').value = '';
  const resultsContainer = document.getElementById('recommendationResults');
  if (resultsContainer) resultsContainer.innerHTML = '';
}

function clearResults() {
  const resultsContainer = document.getElementById('recommendationResults');
  if (resultsContainer) {
    resultsContainer.innerHTML = '';
  }
}

function showNewYorkTime() {
  const options = {
    timeZone: 'America/New_York',
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };

  const newYorkTime = new Date().toLocaleTimeString('en-US', options);
  console.log("Current time in New York:", newYorkTime);

  const timeDisplay = document.getElementById('timeDisplay') || document.createElement('div');
  timeDisplay.id = 'timeDisplay';
  timeDisplay.style.marginTop = '20px';
  timeDisplay.style.fontSize = '1.2em';
  timeDisplay.style.fontWeight = 'bold';
  timeDisplay.textContent = `Current time in New York: ${newYorkTime}`;
  document.body.appendChild(timeDisplay);
}

// Carregar os dados quando a página carregar
window.onload = fetchRecommendations;