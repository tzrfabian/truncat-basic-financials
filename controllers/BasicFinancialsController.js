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
      const response_profile = await axios.get(
        `https://finnhub.io/api/v1/stock/profile?symbol=${symbol}&token=${FINNHUB_API_KEY}`
      );
      const price_metrics = await axios.get(
        `https://finnhub.io/api/v1/stock/price-metric?symbol=${symbol}&token=${FINNHUB_API_KEY}`
      );
      const response_basic_financials = await axios.get(
        `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_API_KEY}`
      );

      if (response_basic_financials.status === 200 && response_profile.status === 200 && price_metrics.status === 200) {
        // Extracting the relevant data from the response
        const profile = response_profile.data;
        const b_financials = response_basic_financials.data.metric;
        const price_metric = price_metrics.data.data;

        const selectedData = {
          company_profile: {
            name: profile.name,
            gsector: profile.gsector,
            marketCapitalization: profile.marketCapitalization,
            ['52WeekHigh']: price_metric['52WeekHigh'],
            ['52WeekLow']: price_metric['52WeekLow'],
            beta: price_metric.beta,
            ytdPriceReturn: price_metric.ytdPriceReturn,
            ['52WeekPriceReturnDaily']: b_financials['52WeekPriceReturnDaily'],
          },
          financials_report: {},
          financials_metric: {
            marketCapitalization: b_financials['52WeekPriceReturnDaily'],
            bookValuePerShareAnnual: b_financials.bookValuePerShareAnnual,
            epsAnnual: b_financials.epsAnnual,
            currentDividendYieldTTM: b_financials.currentDividendYieldTTM,
            dividendPerShareAnnual: b_financials.dividendPerShareAnnual,
            dividendPerShareTTM: b_financials.dividendPerShareTTM,
            grossMarginAnnual: b_financials.grossMarginAnnual,
            ['longTermDebt/equityAnnual']: b_financials['longTermDebt/equityAnnual'],
            ['totalDebt/totalEquityAnnual']: b_financials['totalDebt/totalEquityAnnual'],
            netProfitMargin5Y: b_financials.netProfitMargin5Y,
            netProfitMarginAnnual: b_financials.netProfitMarginAnnual,
            peAnnual: b_financials.peAnnual,
            pbAnnual: b_financials.pbAnnual,
            quickRatioAnnual: b_financials.quickRatioAnnual,
            currentRatioAnnual: b_financials.currentRatioAnnual,
            roa5Y: b_financials.roa5Y,
            roe5Y: b_financials.roe5Y,
            period: b_financials.period
        }
      };

        return res.status(200).json(selectedData);
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