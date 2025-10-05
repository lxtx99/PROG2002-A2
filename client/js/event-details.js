document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Event details page loaded');
    loadEventDetails();
    setupModal();
});

async function loadEventDetails() {
    const eventId = getUrlParam('id');
    
    if (!eventId) {
        showError('Event ID not specified.');
        hideLoading();
        return;
    }
    
    try {
        showEventLoading();
        hideError();
        
        const data = await callAPI(`/events/${eventId}`);
        
        if (data.status === 'success') {
            displayEventDetails(data.event);
        } else {
            throw new Error('Failed to load event details');
        }
        
    } catch (error) {
        console.error('Error loading event details:', error);
        showError('Failed to load event details. Please try again.');
    } finally {
        hideEventLoading();
    }
}

function showEventLoading() {
    const loadingDiv = document.getElementById('loading-message');
    const detailsDiv = document.getElementById('event-details');
    if (loadingDiv) loadingDiv.style.display = 'block';
    if (detailsDiv) detailsDiv.style.display = 'none';
}

function hideEventLoading() {
    const loadingDiv = document.getElementById('loading-message');
    const detailsDiv = document.getElementById('event-details');
    if (loadingDiv) loadingDiv.style.display = 'none';
    if (detailsDiv) detailsDiv.style.display = 'block';
}

function displayEventDetails(event) {
    const container = document.getElementById('event-details');
    const progressPercentage = event.charity_goal ? 
        ((event.current_progress / event.charity_goal) * 100).toFixed(1) : 0;
    
    container.innerHTML = `
        <section class="event-header">
            <div class="breadcrumb">
                <a href="index.html">Home</a> &gt; 
                <a href="search.html">Events</a> &gt; 
                <span>${event.event_name}</span>
            </div>
            
            <h1>${event.event_name}</h1>
            <div class="event-meta">
                <span class="category-badge">${event.category_name || 'General'}</span>
                <span class="organizer">Organized by ${event.charity_name || 'Hope Light Foundation'}</span>
            </div>
        </section>

        <section class="event-content">
            <div class="event-main">
                <div class="event-image-large">
                    <img src="https://via.placeholder.com/800x400/4CAF50/white?text=${encodeURIComponent(event.event_name)}" 
                         alt="${event.event_name}">
                </div>
                
                <div class="event-description-full">
                    <h3>About This Event</h3>
                    <p>${event.event_description || 'No description available.'}</p>
                </div>
                
                <div class="event-fundraising">
                    <h3>Fundraising Progress</h3>
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                        </div>
                        <div class="progress-stats">
                            <span class="raised">${formatCurrency(parseFloat(event.current_progress || 0))} raised</span>
                            <span class="goal">of ${formatCurrency(parseFloat(event.charity_goal || 0))} goal</span>
                            <span class="percentage">(${progressPercentage}%)</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="event-sidebar">
                <div class="event-info-card">
                    <h3>Event Information</h3>
                    <div class="info-item">
                        <strong>📅 Date & Time</strong>
                        <p>${formatDate(event.event_date)}</p>
                    </div>
                    <div class="info-item">
                        <strong>📍 Location</strong>
                        <p>${event.event_location}</p>
                    </div>
                    <div class="info-item">
                        <strong>🎫 Ticket Price</strong>
                        <p class="ticket-price">${event.ticket_price ? formatCurrency(parseFloat(event.ticket_price)) : 'Free'}</p>
                    </div>
                    <div class="info-item">
                        <strong>📋 Category</strong>
                        <p>${event.category_name || 'General'}</p>
                    </div>
                    
                    <button id="register-btn" class="btn-primary btn-large">Register for Event</button>
                </div>
                
                <div class="organizer-info">
                    <h3>Organizer</h3>
                    <div class="organizer-details">
                        <h4>${event.charity_name || 'Hope Light Foundation'}</h4>
                        <p>${event.mission_statement || 'Helping make the world a better place.'}</p>
                        ${event.contact_email ? `<p>📧 ${event.contact_email}</p>` : ''}
                        ${event.phone ? `<p>📞 ${event.phone}</p>` : ''}
                        ${event.address ? `<p>📍 ${event.address}</p>` : ''}
                    </div>
                </div>
            </div>
        </section>
    `;
    
    // 设置注册按钮事件
    document.getElementById('register-btn').addEventListener('click', showRegisterModal);
}

function setupModal() {
    const modal = document.getElementById('register-modal');
    const closeBtn = document.querySelector('.close-btn');
    const closeModalBtn = document.getElementById('close-modal');
    
    // 关闭模态框
    function closeModal() {
        modal.style.display = 'none';
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    
    // 点击模态框外部关闭
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
}

function showRegisterModal() {
    const modal = document.getElementById('register-modal');
    modal.style.display = 'block';
}