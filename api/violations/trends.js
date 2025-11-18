// Serverless API for violation trends
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

  const { time_period } = req.query;
  
  let mockTrends;
  
  if (time_period === 'monthly') {
    mockTrends = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [150, 200, 180, 220, 175, 190]
    };
  } else if (time_period === 'weekly') {
    mockTrends = {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: [45, 52, 38, 65]
    };
  } else {
    mockTrends = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [8, 12, 15, 18, 22, 25, 10]
    };
  }

  if (req.method === 'GET') {
    res.status(200).json(mockTrends);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}