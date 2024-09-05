"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MortgageCalculator = void 0;
class MortgageCalculator {
    constructor(propertyPrice, downPayment, annualInterestRate, amortizationPeriod, paymentSchedule) {
        this.propertyPrice = propertyPrice;
        this.downPayment = downPayment;
        this.annualInterestRate = annualInterestRate;
        this.amortizationPeriod = amortizationPeriod;
        this.paymentSchedule = paymentSchedule;
    }
    validateInputs() {
        if (this.downPayment >= this.propertyPrice * 0.8) {
            throw new Error("Down payment must be less than 80% of the property price");
        }
        if (this.annualInterestRate <= 0) {
            throw new Error("Annual interest rate must be greater than 0");
        }
    }
    calculateCMHCInsurance() {
        let premiumRate = 0;
        const downPaymentPercentage = this.downPayment / this.propertyPrice;
        if (downPaymentPercentage < 0.1) {
            premiumRate = 0.04; // 4.0% for less than 10% down payment
        }
        else if (downPaymentPercentage >= 0.1 && downPaymentPercentage < 0.15) {
            premiumRate = 0.031; // 3.1% for 10% to 15% down payment
        }
        else if (downPaymentPercentage >= 0.15 && downPaymentPercentage < 0.2) {
            premiumRate = 0.028; // 2.8% for 15% to 20% down paymentasdasdasdasd
        }
        const mortgageAmount = this.propertyPrice - this.downPayment;
        return mortgageAmount * premiumRate;
    }
    calculateMortgage() {
        this.validateInputs();
        const principal = this.propertyPrice - this.downPayment + this.calculateCMHCInsurance();
        const schedules = {
            monthly: 12,
            "bi-weekly": 26,
            "accelerated bi-weekly": 26,
        };
        const numberOfPayments = this.amortizationPeriod * schedules[this.paymentSchedule];
        const scheduleInterestRate = this.annualInterestRate / 100 / schedules[this.paymentSchedule];
        const payment = (principal *
            scheduleInterestRate *
            Math.pow(1 + scheduleInterestRate, numberOfPayments)) /
            (Math.pow(1 + scheduleInterestRate, numberOfPayments) - 1);
        return payment;
    }
}
exports.MortgageCalculator = MortgageCalculator;
