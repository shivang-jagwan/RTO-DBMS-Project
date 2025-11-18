// Serverless API for repeat offenders
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

  const { min_violations } = req.query;
  const minViolations = parseInt(min_violations) || 3;

  const mockOffenders = [
    {
      vehicle_number: "MH12AB1234",
      driver_license: "DL1234567890",
      violation_count: 8,
      latest_date: "2025-11-18",
      total_fines: 15000
    },
    {
      vehicle_number: "DL03CD5678",
      driver_license: "DL0987654321",
      violation_count: 6,
      latest_date: "2025-11-16",
      total_fines: 25000
    },
    {
      vehicle_number: "KA05EF9012",
      driver_license: "DL5432167890",
      violation_count: 5,
      latest_date: "2025-11-17",
      total_fines: 12500
    },
    {
      vehicle_number: "TN09GH3456",
      driver_license: "DL6789054321",
      violation_count: 4,
      latest_date: "2025-11-15",
      total_fines: 8000
    }
  ].filter(offender => offender.violation_count >= minViolations);

  if (req.method === 'GET') {
    res.status(200).json(mockOffenders);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}