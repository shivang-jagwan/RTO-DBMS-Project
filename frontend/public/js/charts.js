// Charts configuration for Traffic Violation Dashboard

let charts = {};

function initCharts() {
    if (typeof chartData === 'undefined') {
        console.warn('Chart data not available');
        return;
    }

    // Destroy existing charts
    Object.values(charts).forEach(chart => chart.destroy());

    // Create charts
    createViolationsChart();
    createLocationsChart();
    createHourlyChart();
    createVehicleChart();
    createTrendsChart();
}

function createViolationsChart() {
    const ctx = document.getElementById('violationsChart');
    if (!ctx) return;

    const data = chartData.violations;
    charts.violations = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function createLocationsChart() {
    const ctx = document.getElementById('locationsChart');
    if (!ctx) return;

    const data = chartData.locations;
    charts.locations = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: 'Violations',
                data: Object.values(data),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function createHourlyChart() {
    const ctx = document.getElementById('hourlyChart');
    if (!ctx) return;

    const data = chartData.hourly;
    charts.hourly = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(data).map(hour => `${hour}:00`),
            datasets: [{
                label: 'Violations',
                data: Object.values(data),
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function createVehicleChart() {
    const ctx = document.getElementById('vehicleChart');
    if (!ctx) return;

    const data = chartData.vehicles;
    charts.vehicle = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

function createTrendsChart() {
    const ctx = document.getElementById('trendsChart');
    if (!ctx) return;

    charts.trends = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.trends.labels,
            datasets: [{
                label: 'Monthly Violations',
                data: chartData.trends.data,
                borderColor: 'rgba(220, 53, 69, 1)',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(220, 53, 69, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                },
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Month'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function updateCharts(newData) {
    if (charts.violations && newData.top_violations) {
        charts.violations.data.labels = Object.keys(newData.top_violations);
        charts.violations.data.datasets[0].data = Object.values(newData.top_violations);
        charts.violations.update();
    }

    if (charts.locations && newData.top_locations) {
        charts.locations.data.labels = Object.keys(newData.top_locations);
        charts.locations.data.datasets[0].data = Object.values(newData.top_locations);
        charts.locations.update();
    }

    if (charts.hourly && newData.violations_by_hour) {
        charts.hourly.data.datasets[0].data = Object.values(newData.violations_by_hour);
        charts.hourly.update();
    }

    if (charts.vehicle && newData.vehicle_types) {
        charts.vehicle.data.labels = Object.keys(newData.vehicle_types);
        charts.vehicle.data.datasets[0].data = Object.values(newData.vehicle_types);
        charts.vehicle.update();
    }
}

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initCharts, 100); // Small delay to ensure DOM is ready
});

// Handle window resize
window.addEventListener('resize', function() {
    Object.values(charts).forEach(chart => {
        if (chart.resize) {
            chart.resize();
        }
    });
});
