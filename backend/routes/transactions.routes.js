const router = require("express").Router();
const {
    initialize,
    transactions,
    statistics,
    barchart,
    piechart,
    combined
} = require('../controller/transaction.controller');

router.get('/initialize', initialize);
router.get('/transactions', transactions);
router.get('/statistics', statistics);
router.get('/barchart', barchart);
router.get('/piechart', piechart);
router.get('/combined', combined);

module.exports = router;