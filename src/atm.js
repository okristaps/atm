import { calculateDeposit, calculateWithdrawal } from "./helpers.js";

const supportedBills = [1, 5, 10, 20, 100, 500, 1000];

class ATM {
  constructor() {
    this.bills = [];
    this.atmEnabled = false;
    this.atmStock = {};
  }

  initializeStock(bills) {
    this.atmStock.total = bills.reduce((total, bill) => {
      // rng stock
      const amount = Math.floor(Math.random() * 30); // simulate money inside the atm
      // const amount = 0;
      this.atmStock[bill] = amount;
      return total + amount * bill;
    }, 0);
  }

  initializeAtm(bills = null) {
    if (this.atmEnabled) {
      throw new Error("ATM is already initialized!");
    }

    if (bills === null) {
      bills = supportedBills;
    } else {
      for (const bill of bills) {
        if (!supportedBills.includes(bill)) {
          throw new Error(`Unsupported bill type: ${bill}`);
        }
      }
    }

    if (!bills.includes(1)) bills.push(1); // add support for 1$ bill

    this.initializeStock(bills);
    this.atmEnabled = true;
    this.bills = bills;

    return "ATM is ready!";
  }

  deposit(amount) {
    if (!amount) {
      throw new Error("No deposit amount specified");
    }

    const depositTransaction = calculateDeposit(amount, supportedBills);

    console.log("depositTransaction", depositTransaction);

    if (depositTransaction) {
      for (const [bill, count] of Object.entries(depositTransaction)) {
        this.atmStock[bill] += count;
      }
      this.atmStock.total += amount;

      return {
        message: `Successful DEPOSIT of ${amount} TDL dollars!`,
        transaction: { ...depositTransaction, total: amount },
      };
    } else {
      return { message: "Transaction failed. Insufficient bills in the ATM." };
    }
  }

  withdraw(amount) {
    if (!amount) {
      throw new Error("No withdraw amount specified");
    }

    if (this.atmStock.total < amount) {
      return { message: "Transaction failed. Insufficient funds in the ATM." };
    }

    const transaction = calculateWithdrawal(amount, this.atmStock);

    if (transaction) {
      for (const [bill, count] of Object.entries(transaction)) {
        this.atmStock[bill] -= count;
      }
      this.atmStock.total -= amount;

      return {
        message: `Successful WITHDRAWAL of ${amount} TDL dollars!`,
        transaction: { ...transaction, total: amount },
      };
    } else {
      return { message: "Not enough bills to complete the transaction!" };
    }
  }
}

export default new ATM();
