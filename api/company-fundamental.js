require('dotenv').config();
const axios = require('axios');
const errorHandler = require('../middlewares/errorHandler');

const { FINNHUB_API_KEY } = process.env;

module.exports = async (req, res) => {
  try {
    // Validate HTTP method
    if (req.method !== 'GET') {
      return errorHandler(res, 405, 'Method Not Allowed');
    }

    // Validate query parameters
    const { symbol } = req.query;
    if (!symbol) {
      return errorHandler(res, 400, 'Symbol is required');
    }

    // Fetch data from APIs
    const [
        response_profile,
        price_metrics,
        response_basic_financials,
        response_financials_bs,
        response_financials_ic,
        response_financials_cf,
      ] = await Promise.all([
        axios.get(`https://finnhub.io/api/v1/stock/profile?symbol=${symbol}&token=${FINNHUB_API_KEY}`),
        axios.get(`https://finnhub.io/api/v1/stock/price-metric?symbol=${symbol}&token=${FINNHUB_API_KEY}`),
        axios.get(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_API_KEY}`),
        axios.get(`https://finnhub.io/api/v1/stock/financials?symbol=${symbol}&statement=bs&freq=annual&token=${FINNHUB_API_KEY}`),
        axios.get(`https://finnhub.io/api/v1/stock/financials?symbol=${symbol}&statement=ic&freq=annual&token=${FINNHUB_API_KEY}`),
        axios.get(`https://finnhub.io/api/v1/stock/financials?symbol=${symbol}&statement=cf&freq=annual&token=${FINNHUB_API_KEY}`),
      ]);

    // Validate API responses
    if (
      response_basic_financials.status === 200 &&
      response_profile.status === 200 &&
      price_metrics.status === 200
    ) {
      // Extract data safely
      const profile = response_profile.data || {};
      const price_metric = price_metrics.data.data || {};
      const financials_bs = response_financials_bs.data.financials?.[0] || {};
      const financials_ic = response_financials_ic.data.financials?.[0] || {};
      const financials_cf = response_financials_cf.data.financials?.[0] || {};
      const b_financials = response_basic_financials.data.metric || {};

      // Prepare the response
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
        financials_report: {
          currentAssets: financials_bs.currentAssets,
          currentLiabilities: financials_bs.currentLiabilities,
          totalAssets: financials_bs.totalAssets,
          totalLiabilities: financials_bs.totalLiabilities,
          totalEquity: financials_bs.totalEquity,
          revenue: financials_ic.revenue,
          costOfGoodsSold: financials_ic.costOfGoodsSold,
          grossIncome: financials_ic.grossIncome,
          netIncome: financials_ic.netIncome,
          netOperatingCashFlow: financials_cf.netOperatingCashFlow,
          netInvestingCashFlow: financials_cf.netInvestingCashFlow,
          netCashFinancingActivities: financials_cf.netCashFinancingActivities,
          cashDividendsPaid: financials_cf.cashDividendsPaid,
          changeinCash: financials_cf.changeinCash,
          period: financials_cf.period,
        },
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
          period: b_financials.period,
        },
      };

      return res.status(200).json(selectedData);
    } else {
      return errorHandler(res, 404, 'Failed to fetch data');
    }
  } catch (error) {
    console.error('Error fetching basic financials:', error.message);
    return errorHandler(res, 500, error.message || 'Internal Server Error');
  }
};