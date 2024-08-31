import express from "express";
import ATMState from "./atm.js";
import { checkIfATMInitialized } from "./helpers.js";

const router = express.Router();

router.post("/init", (req, res) => {
  try {
    res.json({ message: ATMState.initializeAtm(req.body.bills ?? null) });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/deposit", checkIfATMInitialized, (req, res) => {
  try {
    const result = ATMState.deposit(req.body.amount);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/withdraw", checkIfATMInitialized, (req, res) => {
  try {
    const result = ATMState.withdraw(req.body.amount);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// //

router.get("/balance", checkIfATMInitialized, (req, res) => {
  const balance = {
    balance: ATMState.atmStock,
  };
  res.json(balance);
});

export default router;
