// Main JavaScript file for Traffic Violation Dashboard

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Auto-refresh functionality for dashboard
    if (document.querySelector('.dashboard-auto-refresh')) {
        setInterval(function() {
            refreshDashboardData();
        }, 30000); // Refresh every 30 seconds
    }

    // Handle form submissions with AJAX
    const forms = document.querySelectorAll('.ajax-form');
    forms.forEach(form => {
        form.addEventListener('submit', handleAjaxForm);
    });

    // Handle pagination
    const paginationLinks = document.querySelectorAll('.pagination-link');
    paginationLinks.forEach(link => {
        link.addEventListener('click', handlePagination);
    });

    // Handle filter changes
    const filters = document.querySelectorAll('.filter-select');
    filters.forEach(filter => {
        filter.addEventListener('change', handleFilterChange);
    });

    console.log('Traffic Violation Dashboard initialized');
});

// Event listener for the send alert button
document.addEventListener('click', function(event) {
    if (event.target.matches('#send-alert-btn')) {
        const btn = event.target;
        const source = btn.dataset.source;
        const violationId = btn.dataset.violationId;
        const licenseNumber = btn.dataset.licenseNumber;

        // Disable button and show loading state
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';

        fetch('/alerts/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    source: source,
                    violation_id: violationId,
                    license_number: licenseNumber
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                return response.json().then(errorData => {
                    const error = new Error(errorData.detail || 'An unknown server error occurred.');
                    error.response = response;
                    throw error;
                });
            })
            .then(data => {
                let message = `Twilio alert sent successfully! SID: ${data.message_sid}`;
                globalToast(message, 'success');

                // Restore button state
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Send Unpaid Fine Alert';
            })
            .catch(error => {
                console.error('Error sending alert:', error.message);
                globalToast(`Error: ${error.message}`, 'error');

                // Restore button state
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Send Unpaid Fine Alert';
            });
    }
});


// Global toast helper (used if present by detail/repeat pages)
function globalToast(message, type = 'success') {
    // Determine the final message and type based on the response
    let finalMessage = message;
    let finalType = type;

    if (message.includes("Alert processed")) {
        const emailStatus = message.includes("email: sent") ? "sent" : "failed";
        const smsStatus = message.includes("sms: sent") ? "sent" : "failed";

        if (emailStatus === "sent" && smsStatus === "sent") {
            finalMessage = "Alert sent successfully via Email and SMS.";
            finalType = "success";
        } else if (emailStatus === "sent") {
            finalMessage = "Alert sent via Email, but SMS failed.";
            finalType = "warning";
        } else if (smsStatus === "sent") {
            finalMessage = "Alert sent via SMS, but Email failed.";
            finalType = "warning";
        } else {
            finalMessage = "Alert failed to send via Email and SMS.";
            finalType = "error";
        }
    }
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'position-fixed top-0 end-0 p-3';
        document.body.appendChild(container);
    }
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
            <div class="toast align-items-center text-bg-${finalType === 'success' ? 'success' : (finalType === 'warning' ? 'warning' : 'danger')} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">${finalMessage}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>`;
    const toastEl = wrapper.firstElementChild;
    container.appendChild(toastEl);
    const toast = new bootstrap.Toast(toastEl, {
        delay: 4000
    });
    toast.show();
}

// Test server connectivity
async function testServerConnection() {
    try {
        console.log('🔍 Testing server connection...');
        const response = await fetch('/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            console.log('✅ Server connection successful');
            return true;
        } else {
            console.error('❌ Server responded with error:', response.status);
            return false;
        }
    } catch (error) {
        console.error('❌ Server connection failed:', error.message);
        return false;
    }
}

function refreshDashboardData() {
    fetch('/data')
        .then(response => response.json())
        .then(data => {
            updateDashboardStats(data);
        })
        .catch(error => {
            console.error('Error refreshing dashboard data:', error);
        });
}

function updateDashboardStats(data) {
    // Update statistics cards
    const totalViolations = document.querySelector('.total-violations');
    const totalFines = document.querySelector('.total-fines');
    const avgFine = document.querySelector('.avg-fine');

    if (totalViolations) {
        totalViolations.textContent = data.total_violations.toLocaleString();
    }
    if (totalFines) {
        totalFines.textContent = '₹' + data.total_fines.toLocaleString();
    }
    if (avgFine) {
        avgFine.textContent = '₹' + Math.round(data.avg_fine_amount).toLocaleString();
    }

    // Update charts if Chart.js is available
    if (typeof Chart !== 'undefined') {
        updateCharts(data);
    }
}

function handleAjaxForm(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const action = form.action;
    const method = form.method || 'POST';

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="loading"></span> Processing...';
    submitBtn.disabled = true;

    fetch(action, {
        method: method,
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Handle success
        showAlert('success', 'Operation completed successfully');
        // Reload page or update content
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    })
    .catch(error => {
        console.error('Form submission error:', error);
        showAlert('error', 'An error occurred. Please try again.');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

function handlePagination(event) {
    event.preventDefault();
    const link = event.target.closest('a');
    const url = link.href;

    // Show loading state
    const container = document.querySelector('.violations-container');
    if (container) {
        container.innerHTML = '<div class="text-center py-4"><div class="loading"></div> Loading...</div>';
    }

    fetch(url, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.text())
    .then(html => {
        // Update the container with new content
        if (container) {
            container.innerHTML = html;
        } else {
            window.location.href = url;
        }
    })
    .catch(error => {
        console.error('Pagination error:', error);
        window.location.href = url;
    });
}

function handleFilterChange(event) {
    const filter = event.target;
    const form = filter.closest('form');

    if (form) {
        // Debounce filter changes
        clearTimeout(window.filterTimeout);
        window.filterTimeout = setTimeout(() => {
            form.submit();
        }, 500);
    }
}

function showAlert(type, message) {
    const alertContainer = document.querySelector('.alert-container') || document.body;

    const alert = document.createElement('div');
    alert.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    alertContainer.insertBefore(alert, alertContainer.firstChild);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    return timeString; // Return as-is for now
}

// Utility function to check if backend is connected
function checkBackendConnection() {
    const statusIndicator = document.querySelector('.backend-status');
    if (statusIndicator) {
        fetch('/api/health')
            .then(response => {
                if (response.ok) {
                    statusIndicator.className = 'backend-status status-connected';
                    statusIndicator.innerHTML = '<i class="fas fa-plug"></i> Backend Connected';
                } else {
                    throw new Error('Backend not responding');
                }
            })
            .catch(error => {
                statusIndicator.className = 'backend-status status-disconnected';
                statusIndicator.innerHTML = '<i class="fas fa-plug"></i> Backend Disconnected';
            });
    }
}

// Check backend connection every 30 seconds
setInterval(checkBackendConnection, 30000);

// Initial check
checkBackendConnection();
