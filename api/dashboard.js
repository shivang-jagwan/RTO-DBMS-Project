// Serverless API for dashboard data
const mockData = {
  totalViolations: 4000,
  lastUpdated: "2025-11-18",
  violationTypes: {
    "Speeding": 50,
    "Parking": 30,
    "Signal": 20
  },
  topLocations: {
    "Location 1": 25,
    "Location 2": 15,
    "Location 3": 10
  },
  vehicleTypes: {
    "Car": 60,
    "Bike": 25,
    "Truck": 15
  },
  fineStats: {
    total: 50000.0,
    average: 1500.0,
    max: 5000.0,
    min: 500.0
  },
  message: "Data loaded successfully - 4000 violations found"
};

export default function handler(req, res) {
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
    res.status(200).json(mockData);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}