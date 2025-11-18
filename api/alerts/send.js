// Serverless API for SMS alerts
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { phone_number, message, violation_id, license_number } = req.body;

      // Validate input
      if (!phone_number || !message) {
        return res.status(400).json({
          success: false,
          error: "Phone number and message are required"
        });
      }

      // For demo purposes, simulate successful SMS sending
      // In production, you would integrate with Twilio here
      const mockResponse = {
        success: true,
        message: "Alert sent successfully",
        alert_id: `alert_${Date.now()}`,
        details: {
          to: phone_number,
          violation_id: violation_id || "N/A",
          license_number: license_number || "N/A",
          timestamp: new Date().toISOString()
        }
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      res.status(200).json(mockResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to send alert",
        details: error.message
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}