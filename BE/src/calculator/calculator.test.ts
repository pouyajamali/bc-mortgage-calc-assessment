import { MortgageCalculator } from "./calculator.model";
import express from "express";
import supertest from "supertest";
import { handleCalculateMortgage } from "./calculator.controller";

describe("MortgageCalculator", () => {
  it("should correctly calculate the CMHC insurance premium", () => {
    const calculator = new MortgageCalculator(
      300000,
      40000,
      3.5,
      25,
      "monthly"
    );
    const cmhcPremium = calculator["calculateCMHC"]();
    expect(cmhcPremium).toBeCloseTo(8060);
  });

  it("should calculate monthly mortgage payment correctly", () => {
    const calculator = new MortgageCalculator(
      300000,
      40000,
      3.5,
      25,
      "monthly"
    );
    const payment = calculator.calculateMortgage();
    expect(payment).toBeCloseTo(1341.97, 0);
  });

  it("should calculate accelerated bi-weekly mortgage payment correctly", () => {
    const calculator = new MortgageCalculator(
      300000,
      40000,
      3.5,
      25,
      "accelerated bi-weekly"
    );
    const payment = calculator.calculateMortgage();
    expect(payment).toBeCloseTo(670.99);
  });

  it("should throw an error if amortization period is not one of 5, 10, 15, 20, 25, 30 years", () => {
    expect(() => {
      const calculator = new MortgageCalculator(
        300000,
        40000,
        3.5,
        //@ts-expect-error
        40,
        "monthly"
      );
      calculator.calculateMortgage();
    }).toThrow(
      "Invalid amortization period. Must be one of 5, 10, 15, 20, 25, 30 years."
    );
  });

  it("should throw an error if payment schedule is not one of 'monthly', 'bi-weekly', 'accelerated bi-weekly'", () => {
    expect(() => {
      const calculator = new MortgageCalculator(
        300000,
        40000,
        3.5,
        25,
        //@ts-expect-error
        "weekly"
      );
      calculator.calculateMortgage();
    }).toThrow(
      "Invalid payment schedule. Must be one of 'monthly', 'bi-weekly', 'accelerated bi-weekly'."
    );
  });

  it("should throw an error if down payment is less than 5% of the property price", () => {
    const propertyPrice = 300000;
    const downPayment = 12000;

    expect(() => {
      const calculator = new MortgageCalculator(
        propertyPrice,
        downPayment,
        3.5,
        20,
        "monthly"
      );
      calculator.calculateMortgage();
    }).toThrowError(
      new RegExp(
        `Down payment must be at least 5% of the property price\\. Minimum required down payment is \\$${(
          propertyPrice * 0.05
        )
          .toFixed(2)
          .replace(/\.00$/, "")}\\.$`
      )
    );
  });

  it("should throw an error if down payment is 80% or more of the property price", () => {
    const propertyPrice = 300000;
    const downPayment = 240000;

    expect(() => {
      const calculator = new MortgageCalculator(
        propertyPrice,
        downPayment,
        3.5,
        20,
        "monthly"
      );
      calculator.calculateMortgage();
    }).toThrowError(
      new RegExp(
        `Down payment must be less than 80% of the property price\\. Your down payment should be smaller than \\$${(
          propertyPrice * 0.8
        ).toFixed(0)}\\.$`
      )
    );
  });

  it("should throw an error if down payment is less than the minimum required for properties over $500,000", () => {
    const propertyPrice = 600000;
    const downPayment = 30000;

    expect(() => {
      const calculator = new MortgageCalculator(
        propertyPrice,
        downPayment,
        3.5,
        25,
        "monthly"
      );
      calculator.calculateMortgage();
    }).toThrowError(
      new RegExp(
        `For properties over \\$500,000, the minimum down payment is 5% of the first \\$500,000 and 10% of any amount over \\$500,000\\. Minimum required down payment is \\$${(
          500000 * 0.05 +
          (propertyPrice - 500000) * 0.1
        ).toFixed(2)}\\.`
      )
    );
  });

  it("should throw an error if amortization period exceeds 25 years or property price is more than $1,000,000 and down payment is less than 20%", () => {
    const propertyPrice = 1200000;
    const downPayment = 200000;

    expect(() => {
      const calculator = new MortgageCalculator(
        propertyPrice,
        downPayment,
        3.5,
        30,
        "monthly"
      );
      calculator.calculateMortgage();
    }).toThrowError(
      new RegExp(
        `if amortization period exceeds 25 years or property price is more than \\$1,000,000 CMHC insurance is not available\\. Therefore, the down payment must be at least 20%\\. Minimum required down payment is \\$${(
          propertyPrice * 0.2
        ).toFixed(0)}\\.$`
      )
    );
  });
});

const app = express();
app.use(express.json());
app.post("/calculate-mortgage", handleCalculateMortgage);

describe("MortgageController", () => {
  it("should return payment amount for valid input", async () => {
    const propertyPrice = 300000;
    const downPayment = 40000;
    const annualInterestRate = 3.5;
    const amortizationPeriod = 25;
    const paymentSchedule = "monthly";
    const expectedPayment = 1341.97;

    const response = await supertest(app)
      .post("/calculate-mortgage")
      .send({
        propertyPrice,
        downPayment,
        annualInterestRate,
        amortizationPeriod,
        paymentSchedule,
      })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toEqual({ payment: expectedPayment });
  });

  it("should return error for missing required fields", async () => {
    const response = await supertest(app)
      .post("/calculate-mortgage")
      .send({
        propertyPrice: 300000,
      })
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toEqual({ error: "Missing required fields" });
  });

  it("should return error for invalid inputs", async () => {
    const response = await supertest(app)
      .post("/calculate-mortgage")
      .send({
        propertyPrice: 300000,
        downPayment: 40000,
        annualInterestRate: 3.5,
        amortizationPeriod: 10,
        paymentSchedule: "invalid",
      })
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toHaveProperty("error");
  });

  it("should return error for invalid inputs", async () => {
    const response = await supertest(app)
      .post("/calculate-mortgage")
      .send({
        propertyPrice: 300000,
        downPayment: 4000,
        annualInterestRate: 3.5,
        amortizationPeriod: 10,
        paymentSchedule: "monthly",
      })
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toHaveProperty("error");
  });
});
