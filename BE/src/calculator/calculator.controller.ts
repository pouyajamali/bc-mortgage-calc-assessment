import { Request, Response } from "express";
import {
  AmortizationPeriod,
  MortgageCalculator,
  PaymentSchedule,
} from "./calculator.model";

export const handleCalculateMortgage = (req: Request, res: Response) => {
  const {
    propertyPrice,
    downPayment,
    annualInterestRate,
    amortizationPeriod,
    paymentSchedule,
  }: {
    propertyPrice: number;
    downPayment: number;
    annualInterestRate: number;
    amortizationPeriod: number;
    paymentSchedule: string;
  } = req.body;

  try {
    // Quick initial check for missing fields
    if (
      !propertyPrice ||
      !downPayment ||
      !annualInterestRate ||
      !amortizationPeriod ||
      !paymentSchedule
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const amortizationPeriodTyped = amortizationPeriod as AmortizationPeriod;
    const paymentScheduleTyped = paymentSchedule as PaymentSchedule;

    const calculator = new MortgageCalculator(
      propertyPrice,
      downPayment,
      annualInterestRate,
      amortizationPeriodTyped,
      paymentScheduleTyped
    );

    const payment = calculator.calculateMortgage();

    res.json({ payment });
  } catch (error) {
    //@ts-expect-error
    res.status(400).json({ error: error.message });
  }
};
