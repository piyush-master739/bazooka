const express = require("express");
const router = express.Router();
const Transaction = require("../models/transactionModel");

router.route("/makeTransaction").post((req, res) => {
  const transactionId = req.body.transactionId;
  const date = req.body.date;
  const transactionType = req.body.transactionType;
  const from = req.body.from;
  const to = req.body.to;
  const game = req.body.game;
  const tokenToClaim = req.body.tokenToClaim;

  const newTransaction = new Transaction({
    transactionId,
    date,
    transactionType,
    from,
    to,
    game,
    tokenToClaim,
  });

  newTransaction.save();
});

module.exports = router;
