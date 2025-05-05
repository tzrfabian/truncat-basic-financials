require('dotenv').config();

const axios = require('axios');
const { FINNHUB_API_KEY } = process.env;

class BasicFinancialsController {
  static async getBasicFinancials(req, res, next) {
    const { symbol } = req.query;

    if (!symbol) {
      return next({ name: 'ValidationError', message: 'Symbol is required' });
    }

    try {
      const response = await axios.get(
        `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_API_KEY}`
      );

      if (response.status === 200) {
        const metric = response.data.metric;

        const selectedMetrics = {
          metric: {
            marketCapitalization: metric['52WeekPriceReturnDaily'],
            bookValuePerShareAnnual: metric.bookValuePerShareAnnual,
            epsAnnual: metric.epsAnnual,
            currentDividendYieldTTM: metric.currentDividendYieldTTM,
            dividendPerShareAnnual: metric.dividendPerShareAnnual,
            dividendPerShareTTM: metric.dividendPerShareTTM,
            grossMarginAnnual: metric.grossMarginAnnual,
            ['longTermDebt/equityAnnual']: metric['longTermDebt/equityAnnual'],
            ['totalDebt/totalEquityAnnual']: metric['totalDebt/totalEquityAnnual'],
            netProfitMargin5Y: metric.netProfitMargin5Y,
            netProfitMarginAnnual: metric.netProfitMarginAnnual,
            peAnnual: metric.peAnnual,
            pbAnnual: metric.pbAnnual,
            quickRatioAnnual: metric.quickRatioAnnual,
            currentRatioAnnual: metric.currentRatioAnnual,
            roa5Y: metric.roa5Y,
            roe5Y: metric.roe5Y,
            period: metric.period
        }
      };

        return res.status(200).json(selectedMetrics);
      } else {
        return next( { name: 'NotFound', message: 'Failed to fetch data' });
      }
    } catch (error) {
      console.error('Error fetching basic financials:', error);
      return next(error);
    }
  }
}

module.exports = BasicFinancialsController;