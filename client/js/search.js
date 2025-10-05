let categories = [];

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 Search page loaded');
    loadCategories();
    setupEventListeners();
});

async function loadCategories() {
    try {
        const data = await callAPI('/categories');
        
        if (data.status === 'success') {
            categories = data.categories;
            populateCategoryDropdown();
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

function populateCategoryDropdown() {
    const categorySelect = document.getElementById('category');
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.category_name;
        option.textContent = category.category_name;
        categorySelect.appendChild(option);
    });
}

function setupEventListeners() {
    const searchForm = document.getElementById('search-form');
    const clearBtn = document.getElementById('clear-btn');
    
    searchForm.addEventListener('submit', handleSearch);
    clearBtn.addEventListener('click', clearFilters);
}

async function handleSearch(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const searchParams = new URLSearchParams();
    
    // 构建查询参数
    for (const [key, value] of formData.entries()) {
        if (value) {
            searchParams.append(key, value);
        }
    }
    
    try {
        showSearchLoading();
        hideError();
        
        const data = await callAPI(`/events/search?${searchParams}`);
        
        if (data.status === 'success') {
            displaySearchResults(data.events);
        } else {
            throw new Error('Search failed');
        }
        
    } catch (error) {
        console.error('Search error:', error);
        showError('Search failed. Please try again.');
    } finally {
        hideSearchLoading();
    }
}

function showSearchLoading() {
    const loadingDiv = document.getElementById('loading-message');
    const resultsDiv = document.getElementById('search-results');
    if (loadingDiv) loadingDiv.style.display = 'block';
    if (resultsDiv) resultsDiv.style.display = 'none';
}

function hideSearchLoading() {
    const loadingDiv = document.getElementById('loading-message');
    const resultsDiv = document.getElementById('search-results');
    if (loadingDiv) loadingDiv.style.display = 'none';
    if (resultsDiv) resultsDiv.style.display = 'grid';
}

function displaySearchResults(events) {
    const resultsContainer = document.getElementById('search-results');
    
    if (!events || events.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <h3>No Events Found</h3>
                <p>Try adjusting your search criteria.</p>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = events.map(event => `
        <div class="event-card" data-event-id="${event.event_id}">
            <div class="event-info">
                <h3>${event.event_name}</h3>
                <p class="event-category">${event.category_name || 'General'}</p>
                <p class="event-date">📅 ${formatDate(event.event_date)}</p>
                <p class="event-location">📍 ${event.event_location}</p>
                <p class="event-description">${event.event_description}</p>
                
                <div class="event-details">
                    <div class="ticket-price">
                        <strong>Ticket:</strong> 
                        ${event.ticket_price ? formatCurrency(parseFloat(event.ticket_price)) : 'Free'}
                    </div>
                </div>
                
                <div class="event-actions">
                    <a href="event-details.html?id=${event.event_id}" class="btn-primary">View Details</a>
                </div>
            </div>
        </div>
    `).join('');
}

function clearFilters() {
    document.getElementById('search-form').reset();
    document.getElementById('search-results').innerHTML = `
        <div class="no-search">
            <p>Use the search form above to find charity events.</p>
        </div>
    `;
    hideError();
}