// Serverless API for violations stats
const mockStats = [
  {
    vehicle_number: "MH12AB1234",
    violation_type: "Speeding",
    location: "Mumbai Highway",
    date: "2025-11-15",
    fine_amount: 2000,
    payment_status: "pending"
  },
  {
    vehicle_number: "DL03CD5678",
    violation_type: "Signal Jump",
    location: "Delhi Central",
    date: "2025-11-16",
    fine_amount: 5000,
    payment_status: "paid"
  },
  {
    vehicle_number: "KA05EF9012",
    violation_type: "Wrong Lane",
    location: "Bangalore Ring Road",
    date: "2025-11-17",
    fine_amount: 1500,
    payment_status: "pending"
  },
  {
    vehicle_number: "TN09GH3456",
    violation_type: "No Helmet",
    location: "Chennai Beach Road",
    date: "2025-11-18",
    fine_amount: 1000,
    payment_status: "pending"
  }
];

module.exports = function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json(mockStats);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};