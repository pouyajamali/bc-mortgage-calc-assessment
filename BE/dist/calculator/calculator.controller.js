"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMortgage = calculateMortgage;
exports.validateInputs = validateInputs;
function calculateMortgage(principal, annualInterestRate, amortizationYears, paymentSchedule) {
    const schedules = {
        monthly: 12,
        "bi-weekly": 26,
        "accelerated bi-weekly": 26,
    };
    if (!schedules[paymentSchedule]) {
        throw new Error("Invalid payment schedule");
    }
    const numberOfPayments = amortizationYears * schedules[paymentSchedule];
    const monthlyInterestRate = annualInterestRate / 100 / schedules[paymentSchedule];
    if (principal <= 0 || monthlyInterestRate <= 0 || numberOfPayments <= 0) {
        throw new Error("Invalid input values");
    }
    const payment = (principal *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    return payment;
}
function validateInputs(propertyPrice, downPayment, annualInterestRate, amortizationPeriod, paymentSchedule) {
    if (downPayment >= propertyPrice * 0.8) {
        throw new Error("Down payment must be less than 80% of the property price");
    }
    if (annualInterestRate <= 0 ||
        amortizationPeriod % 5 !== 0 ||
        amortizationPeriod < 5 ||
        amortizationPeriod > 30) {
        throw new Error("Invalid input values");
    }
}
// Example Usage:
// const calculator = new MortgageCalculator(500000, 80000, 3.5, 25, "monthly");
// try {
//   const monthlyPayment = calculator.calculateMortgage();
//   console.log(`Monthly Payment: ${monthlyPayment.toFixed(2)}`);
// } catch (error) {
//   //@ts-expect-error
//   console.error(error.message);
// }
