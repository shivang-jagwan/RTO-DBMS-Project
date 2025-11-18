// Serverless API for violation hotspots
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

  const mockHotspots = [
    {
      location: "Main Street & 1st Ave",
      latitude: 28.6139,
      longitude: 77.2090,
      violation_count: 45,
      cluster_size: 3
    },
    {
      location: "Highway 101 & Oak Rd",
      latitude: 28.7041,
      longitude: 77.1025,
      violation_count: 32,
      cluster_size: 2
    },
    {
      location: "City Center Plaza",
      latitude: 28.5355,
      longitude: 77.3910,
      violation_count: 28,
      cluster_size: 2
    }
  ];

  if (req.method === 'GET') {
    res.status(200).json(mockHotspots);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}