// Serverless API for repeat offenders
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

  const { min_violations } = req.query;
  const minViolations = parseInt(min_violations) || 3;

  const mockOffenders = [
    {
      license_number: "DL01AB1234",
      violation_count: 8,
      total_fines: 12000,
      last_violation_date: "2025-11-15",
      most_common_violation: "Speeding"
    },
    {
      license_number: "DL02CD5678",
      violation_count: 6,
      total_fines: 9000,
      last_violation_date: "2025-11-12",
      most_common_violation: "Signal Violation"
    },
    {
      license_number: "DL03EF9012",
      violation_count: 5,
      total_fines: 7500,
      last_violation_date: "2025-11-10",
      most_common_violation: "Parking"
    }
  ].filter(offender => offender.violation_count >= minViolations);

  if (req.method === 'GET') {
    res.status(200).json(mockOffenders);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}