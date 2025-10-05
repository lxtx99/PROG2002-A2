document.addEventListener('DOMContentLoaded', function() {
    console.log('🏠 Home page loaded');
    loadEvents();
});

async function loadEvents() {
    try {
        showLoading();
        hideError();
        
        const data = await callAPI('/events');
        
        if (data.status === 'success') {
            displayEvents(data.events);
        } else {
            throw new Error('Failed to load events');
        }
        
    } catch (error) {
        console.error('Error loading events:', error);
        showError('Failed to load events. Please try again later.');
    } finally {
        hideLoading();
    }
}

function displayEvents(events) {
    const container = document.getElementById('events-container');
    
    if (!events || events.length === 0) {
        container.innerHTML = `
            <div class="no-events">
                <h3>No Upcoming Events</h3>
                <p>Check back later for new charity events!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = events.map(event => `
        <div class="event-card" data-event-id="${event.event_id}">
            <div class="event-image">
                <img src="https://via.placeholder.com/300x200/4CAF50/white?text=Charity+Event" 
                     alt="${event.event_name}" 
                     onerror="this.src='https://via.placeholder.com/300x200/2196F3/white?text=Event+Image'">
            </div>
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
                    <div class="progress-info">
                        <strong>Raised:</strong> 
                        ${formatCurrency(parseFloat(event.current_progress || 0))} 
                        of ${formatCurrency(parseFloat(event.charity_goal || 0))}
                    </div>
                </div>
                
                <div class="event-actions">
                    <a href="event-details.html?id=${event.event_id}" class="btn-primary">View Details & Register</a>
                </div>
            </div>
        </div>
    `).join('');
}