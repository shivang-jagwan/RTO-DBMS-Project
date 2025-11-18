// Main JavaScript file for Traffic Violation Dashboard SPA
// API configuration
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : window.location.origin;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Show dashboard by default
    showSection('dashboard');
    loadDashboardData();
    initCharts();
});

// Navigation function
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Load data based on section
    switch(sectionName) {
        case 'dashboard':
            loadDashboardData();
            initCharts();
            break;
        case 'violations':
            loadViolations();
            break;
        case 'analytics':
            loadAnalytics();
            break;
        case 'hotspots':
            loadHotspots();
            break;
        case 'repeat-offenders':
            loadRepeatOffenders();
            break;
    }
    
    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.querySelector(`a[href="#${sectionName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Load dashboard data
async function loadDashboardData() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard`);
        const data = await response.json();
        
        // Update dashboard cards
        document.getElementById('totalViolations').textContent = data.totalViolations || 0;
        document.getElementById('pendingFines').textContent = data.pendingFines || 0;
        document.getElementById('paidFines').textContent = data.paidFines || 0;
        document.getElementById('totalAmount').textContent = `₹${(data.totalAmount || 0).toLocaleString()}`;
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Set default values if API fails
        document.getElementById('totalViolations').textContent = '0';
        document.getElementById('pendingFines').textContent = '0';
        document.getElementById('paidFines').textContent = '0';
        document.getElementById('totalAmount').textContent = '₹0';
    }
}

// Load violations data
async function loadViolations() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/violations/stats`);
        const data = await response.json();
        
        const tableBody = document.getElementById('violationsTable');
        if (data && data.length > 0) {
            tableBody.innerHTML = data.map(violation => `
                <tr>
                    <td>${violation.vehicle_number || 'N/A'}</td>
                    <td>${violation.violation_type || 'N/A'}</td>
                    <td>${violation.location || 'N/A'}</td>
                    <td>${violation.date ? new Date(violation.date).toLocaleDateString() : 'N/A'}</td>
                    <td>₹${(violation.fine_amount || 0).toLocaleString()}</td>
                    <td>
                        <span class="badge bg-${violation.payment_status === 'paid' ? 'success' : 'warning'}">
                            ${violation.payment_status || 'pending'}
                        </span>
                    </td>
                </tr>
            `).join('');
        } else {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No violations found</td></tr>';
        }
    } catch (error) {
        console.error('Error loading violations:', error);
        document.getElementById('violationsTable').innerHTML = 
            '<tr><td colspan="6" class="text-center text-danger">Error loading violations</td></tr>';
    }
}

// Load analytics data
async function loadAnalytics() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/violations/trends`);
        const data = await response.json();
        
        // Update analytics charts
        updateAnalyticsChart(data);
        updateLocationChart(data);
        
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

// Load hotspots data
async function loadHotspots() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/violations/hotspots`);
        const data = await response.json();
        
        const tableBody = document.getElementById('hotspotsTable');
        if (data && data.length > 0) {
            tableBody.innerHTML = data.map(hotspot => `
                <tr>
                    <td>${hotspot.location || 'N/A'}</td>
                    <td>${hotspot.violation_count || 0}</td>
                    <td>${hotspot.most_common_type || 'N/A'}</td>
                    <td>₹${(hotspot.total_fines || 0).toLocaleString()}</td>
                </tr>
            `).join('');
        } else {
            tableBody.innerHTML = '<tr><td colspan="4" class="text-center">No hotspots data found</td></tr>';
        }
    } catch (error) {
        console.error('Error loading hotspots:', error);
        document.getElementById('hotspotsTable').innerHTML = 
            '<tr><td colspan="4" class="text-center text-danger">Error loading hotspots</td></tr>';
    }
}

// Load repeat offenders data
async function loadRepeatOffenders() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/violations/repeat-offenders`);
        const data = await response.json();
        
        const tableBody = document.getElementById('repeatOffendersTable');
        if (data && data.length > 0) {
            tableBody.innerHTML = data.map(offender => `
                <tr>
                    <td>${offender.vehicle_number || 'N/A'}</td>
                    <td>${offender.driver_license || 'N/A'}</td>
                    <td>${offender.violation_count || 0}</td>
                    <td>${offender.latest_date ? new Date(offender.latest_date).toLocaleDateString() : 'N/A'}</td>
                    <td>₹${(offender.total_fines || 0).toLocaleString()}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="sendAlertToOffender('${offender.vehicle_number}', '${offender.driver_license}')">
                            <i class="fas fa-exclamation-triangle"></i> Send Alert
                        </button>
                    </td>
                </tr>
            `).join('');
        } else {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No repeat offenders found</td></tr>';
        }
    } catch (error) {
        console.error('Error loading repeat offenders:', error);
        document.getElementById('repeatOffendersTable').innerHTML = 
            '<tr><td colspan="6" class="text-center text-danger">Error loading repeat offenders</td></tr>';
    }
}

// Send alert to offender
function sendAlertToOffender(vehicleNumber, licenseNumber) {
    // Set default values in modal
    document.getElementById('phoneNumber').value = '';
    document.getElementById('message').value = `Alert: Multiple violations detected for vehicle ${vehicleNumber}. Please pay pending fines immediately.`;
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('alertModal'));
    modal.show();
}

// Send alert function
async function sendAlert() {
    const phoneNumber = document.getElementById('phoneNumber').value;
    const message = document.getElementById('message').value;
    
    if (!phoneNumber || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/alerts/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phone_number: phoneNumber,
                message: message
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Alert sent successfully!');
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('alertModal'));
            modal.hide();
        } else {
            alert('Error sending alert: ' + (data.detail || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error sending alert:', error);
        alert('Error sending alert: ' + error.message);
    }
}

// Initialize charts
function initCharts() {
    // This function will be called from charts.js
    if (typeof updateDashboardCharts === 'function') {
        updateDashboardCharts();
    }
}

// Update analytics charts
function updateAnalyticsChart(data) {
    // Implementation for analytics chart
    const ctx = document.getElementById('analyticsChart');
    if (ctx && typeof Chart !== 'undefined') {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Violations',
                    data: [12, 19, 3, 5, 2, 3],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            }
        });
    }
}

// Update location chart
function updateLocationChart(data) {
    // Implementation for location chart
    const ctx = document.getElementById('locationChart');
    if (ctx && typeof Chart !== 'undefined') {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Mumbai', 'Delhi', 'Pune', 'Bangalore'],
                datasets: [{
                    data: [30, 25, 20, 15],
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
                }]
            }
        });
    }
}