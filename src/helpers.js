import ATMState from "./atm.js";

const checkIfATMInitialized = (req, res, next) => {
  if (!ATMState.atmEnabled) {
    return res
      .status(400)
      .json({ error: "ATM is not initialized. Please initialize before doing other actions." });
  }
  next();
};

const calculateWithdrawal = (amount, atmStock) => {
  let recur = (amount, bills) => {
    if (amount == 0) return {};
    if (!bills.length) return;
    let nominal = bills[0];
    let count = Math.min(atmStock[nominal], Math.floor(amount / nominal));
    for (let i = count; i >= 0; i--) {
      let result = recur(amount - i * nominal, bills.slice(1));
      if (result) return i ? { [nominal]: i, ...result } : result;
    }
  };
  return recur(
    amount,
    Object.keys(atmStock)
      .map(Number)
      .sort((a, b) => b - a)
  );
};

const calculateDeposit = (amount, supportedBills) => {
  let result = {};

  supportedBills.sort((a, b) => b - a);

  for (const bill of supportedBills) {
    const billCount = Math.floor(amount / bill);

    if (billCount > 0) {
      result[bill] = billCount;
      amount -= billCount * bill;
    }
  }

  return amount === 0 ? result : null;
};

export { checkIfATMInitialized, calculateWithdrawal, calculateDeposit };
