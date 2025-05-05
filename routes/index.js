const BasicFinancialsController = require('../controllers/BasicFinancialsController');

const router = require('express').Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Ping!',
  });
});

router.get('/api/company-fundamental', BasicFinancialsController.getBasicFinancials);

module.exports = router;