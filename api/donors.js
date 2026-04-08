const connectDB = require('./lib/mongodb');
const User = require('./lib/User');

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const donors = await User.find({});
    res.status(200).json(donors);
  } catch (error) {
    console.error('Donors fetch error:', error);
    res.status(500).json({ message: 'Server error fetching donors' });
  }
};
