const BasicFinancialsController = require('../controllers/BasicFinancialsController');
const errorHandler = require('../middlewares/errorHandler');

const router = require('express').Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Ping!',
  });
});

router.get('/api/company-fundamental', BasicFinancialsController.getBasicFinancials);

router.use(errorHandler);

module.exports = router;