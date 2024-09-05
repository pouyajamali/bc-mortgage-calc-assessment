"use strict";
// src/server.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const calculator_controller_1 = require("./calculator/calculator.controller");
const calculator_model_1 = require("./calculator/calculator.model");
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.post("/calculate", (req, res) => {
    const { propertyPrice, downPayment, annualInterestRate, amortizationPeriod, paymentSchedule, } = req.body;
    // Create instance using spread operator
    const calculator = new calculator_model_1.MortgageCalculator(propertyPrice, downPayment, annualInterestRate, amortizationPeriod, paymentSchedule);
    console.log(calculator.calculateMortgage());
    try {
        (0, calculator_controller_1.validateInputs)(propertyPrice, downPayment, annualInterestRate, amortizationPeriod, paymentSchedule);
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        const principal = propertyPrice - downPayment;
        const payment = (0, calculator_controller_1.calculateMortgage)(principal, annualInterestRate, amortizationPeriod, paymentSchedule);
        res.json({ payment });
    }
    catch (error) {
        //@ts-expect-error
        res.status(400).json({ error: error.message });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
