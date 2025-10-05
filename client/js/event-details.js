document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Event details page loaded');
    loadEventDetails();
    setupModal();
});

async function loadEventDetails() {
    const eventId = getUrlParam('id');
    console.log('🔍 Loading event details for ID:', eventId);

    if (!eventId) {
        showError('Event ID not specified.');
        hideLoading();
        return;
    }

    try {
        showEventLoading();
        hideError();
        
        console.log('📡 Calling API: /api/events/' + eventId);
        const data = await callAPI(`/api/events/${eventId}`);
        console.log('✅ API Response:', data);
        
        if (data.status === 'success') {
            displayEventDetails(data.data); // 注意这里改为 data.data
        } else {
            throw new Error(data.message || 'Failed to load event details');
        }
        
    } catch (error) {
        console.error('❌ Error loading event details:', error);
        showError('Failed to load event details: ' + error.message);
    } finally {
        hideEventLoading();
    }
}
//
async function loadEventDetails() {
    const eventId = getUrlParam('id');
    console.log('🔍 Loading event details for ID:', eventId);

    if (!eventId) {
        showError('Event ID not specified.');
        hideLoading();
        return;
    }

    try {
        showEventLoading();
        hideError();
        
        // 直接使用完整URL避免路径问题
        const apiUrl = `http://localhost:5000/api/events/${eventId}`;
        console.log('📡 Calling API:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ API Response:', data);
        
        if (data.status === 'success') {
            displayEventDetails(data.data);
        } else {
            throw new Error(data.message || 'Failed to load event details');
        }
        
    } catch (error) {
        console.error('❌ Error loading event details:', error);
        showError('Failed to load event details: ' + error.message);
    } finally {
        hideEventLoading();
    }
}
//
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
    
    if (!event) {
        container.innerHTML = '<p class="error">Event data is missing.</p>';
        return;
    }

    const progressPercentage = event.charity_goal ?
        Math.round((event.current_progress / event.charity_goal) * 100) : 0;

    container.innerHTML = `
        <section class="event-header">
            <div class="breadcrumb">
                <a href="index.html">Home</a> &gt;
                <a href="search.html">Events</a> &gt;
                <span>${event.title || event.event_name || 'Event'}</span>
            </div>
            
            <h1>${event.title || event.event_name || 'Event'}</h1>
            <div class="event-meta">
                <span class="organizer">Organized by ${event.organization_name || 'Hope Light Foundation'}</span>
            </div>
        </section>
        
        <section class="event-content">
            <div class="event-main">
                <div class="event-image-large">
                    <img src="https://via.placeholder.com/800x400/4CAF50/white?text=${encodeURIComponent(event.title || event.event_name || 'Event')}"
                         alt="${event.title || event.event_name || 'Event'}">
                </div>
                
                <div class="event-description-full">
                    <h3>About This Event</h3>
                    <p>${event.description || event.event_description || 'No description available.'}</p>
                </div>
                
                <div class="event-fundraising">
                    <h3>Fundraising Progress</h3>
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                        </div>
                        <div class="progress-stats">
                            <span class="raised">$${formatCurrency(parseFloat(event.current_progress || 0))} raised</span>
                            <span class="goal">of $${formatCurrency(parseFloat(event.charity_goal || 0))} goal</span>
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
                        <p>${formatDate(event.date || event.event_date)}</p>
                    </div>
                    <div class="info-item">
                        <strong>📍 Location</strong>
                        <p>${event.location || event.event_location || 'TBA'}</p>
                    </div>
                    <div class="info-item">
                        <strong>🎫 Ticket Price</strong>
                        <p class="ticket-price">${event.ticket_price ? '$' + parseFloat(event.ticket_price).toFixed(2) : 'Free'}</p>
                    </div>
                    
                    <button id="register-btn" class="btn-primary btn-large">Register for Event</button>
                </div>
                
                <div class="organizer-info">
                    <h3>Organizer</h3>
                    <div class="organizer-details">
                        <h4>${event.organization_name || 'Hope Light Foundation'}</h4>
                        <p>${event.organization_mission || 'Helping make the world a better place.'}</p>
                        ${event.organization_contact ? `<p>📧 ${event.organization_contact}</p>` : ''}
                    </div>
                </div>
            </div>
        </section>
    `;
    
    // 设置注册按钮事件
    const registerBtn = document.getElementById('register-btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', showRegisterModal);
    }
}

function setupModal() {
    const modal = document.getElementById('register-modal');
    const closeBtn = document.querySelector('.close-btn');
    const closeModalBtn = document.getElementById('close-modal');
    
    // 关闭模态框
    function closeModal() {
        if (modal) modal.style.display = 'none';
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
    if (modal) {
        modal.style.display = 'block';
    }
}

// 确保这些辅助函数存在
function formatCurrency(amount) {
    return typeof amount === 'number' ? amount.toFixed(2) : '0.00';
}

function formatDate(dateString) {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}