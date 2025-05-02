const axios = require('axios');
const { FINNHUB_API_KEY } = process.env;

class BasicFinancialsController {
  static async getBasicFinancials(req, res) {
    const { symbol } = req.params;

    try {
      const response = await axios.get(
        `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_API_KEY}`
      );

      if (response.status === 200) {
        return res.status(200).json(response.data);
      } else {
        return res.status(response.status).json({ error: 'Error fetching data' });
      }
    } catch (error) {
      console.error('Error fetching basic financials:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = BasicFinancialsController;