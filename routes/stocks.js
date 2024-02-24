const express = require("express");
const router = express.Router();
const StocksDriver = require("../drivers/Stocks");

router.post("/ImportDaily", StocksDriver.importDaily);
router.post("/ImportWeekly", StocksDriver.importWeekly);
router.post("/ImportIndDaily", StocksDriver.importIndDaily);
// router.post("/ImportIndWeekly", StocksDriver.importIndWeekly);
router.get("/GetDaily/:last?", StocksDriver.getDaily);
router.get("/GetWeekly/:last?", StocksDriver.getWeekly);
// router.get("/GetIndWeekly/:last?", StocksDriver.getIndWeekly);
router.get("/Call/:last?", StocksDriver.call);

module.exports = router;
