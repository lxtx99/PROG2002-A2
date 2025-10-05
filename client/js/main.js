const API_BASE_URL = 'http://localhost:5000/api';

// 通用API调用函数
async function callAPI(endpoint, options = {}) {
    try {
        console.log(`📡 Calling API: ${endpoint}`);
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`✅ API response from ${endpoint}:`, data);
        return data;
        
    } catch (error) {
        console.error(`❌ API call failed (${endpoint}):`, error);
        throw error;
    }
}

// 显示错误消息
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

// 隐藏错误消息
function hideError() {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// 显示加载状态
function showLoading() {
    const loadingDiv = document.getElementById('loading-message');
    const container = document.getElementById('events-container');
    if (loadingDiv) loadingDiv.style.display = 'block';
    if (container) container.style.display = 'none';
}

// 隐藏加载状态
function hideLoading() {
    const loadingDiv = document.getElementById('loading-message');
    const container = document.getElementById('events-container');
    if (loadingDiv) loadingDiv.style.display = 'none';
    if (container) container.style.display = 'grid';
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 格式化货币
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD'
    }).format(amount);
}

// 获取URL参数
function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}