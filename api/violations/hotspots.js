// Serverless API for violation hotspots
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

  const mockHotspots = [
    {
      location: "Mumbai Highway",
      violation_count: 125,
      most_common_type: "Speeding",
      total_fines: 250000
    },
    {
      location: "Delhi Central",
      violation_count: 98,
      most_common_type: "Signal Jump",
      total_fines: 490000
    },
    {
      location: "Bangalore Ring Road",
      violation_count: 87,
      most_common_type: "Wrong Lane", 
      total_fines: 130500
    },
    {
      location: "Chennai Beach Road",
      violation_count: 64,
      most_common_type: "No Helmet",
      total_fines: 64000
    }
  ];

  if (req.method === 'GET') {
    res.status(200).json(mockHotspots);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}