export type AmortizationPeriod = 5 | 10 | 15 | 20 | 25 | 30;
export type PaymentSchedule = "monthly" | "bi-weekly" | "accelerated bi-weekly";

export class MortgageCalculator {
  private propertyPrice: number;
  private downPayment: number;
  private annualInterestRate: number;
  private amortizationPeriod: AmortizationPeriod;
  private paymentSchedule: PaymentSchedule;

  constructor(
    propertyPrice: number,
    downPayment: number,
    annualInterestRate: number,
    amortizationPeriod: AmortizationPeriod,
    paymentSchedule: PaymentSchedule
  ) {
    this.propertyPrice = propertyPrice;
    this.downPayment = downPayment;
    this.annualInterestRate = annualInterestRate;
    this.amortizationPeriod = amortizationPeriod;
    this.paymentSchedule = paymentSchedule;
  }

  // This functions checks for all the cases of error in mortgage calculation and sends error bodies to the FE so the client can re-adjust the data and use the system
  private validateInputs(): void {
    if (![5, 10, 15, 20, 25, 30].includes(this.amortizationPeriod)) {
      throw new Error(
        "Invalid amortization period. Must be one of 5, 10, 15, 20, 25, 30 years."
      );
    }

    if (
      !["monthly", "bi-weekly", "accelerated bi-weekly"].includes(
        this.paymentSchedule
      )
    ) {
      throw new Error(
        "Invalid payment schedule. Must be one of 'monthly', 'bi-weekly', 'accelerated bi-weekly'."
      );
    }

    if (this.amortizationPeriod > 25 || this.propertyPrice > 1000000) {
      if (this.downPayment < this.propertyPrice * 0.2) {
        throw new Error(
          `if amortization period exceeds 25 years or property price is more than $1,000,000 CMHC insurance is not available. Therefore, the down payment must be at least 20%. Minimum required down payment is $${
            this.propertyPrice * 0.2
          }.`
        );
      }
    }

    if (this.propertyPrice > 500000) {
      const requiredDownPaymentFirst500k = 500000 * 0.05;
      const requiredDownPaymentAbove500k = (this.propertyPrice - 500000) * 0.1;
      const minimumRequiredDownPayment =
        requiredDownPaymentFirst500k + requiredDownPaymentAbove500k;

      if (this.downPayment < minimumRequiredDownPayment) {
        throw new Error(
          `For properties over $500,000, the minimum down payment is 5% of the first $500,000 and 10% of any amount over $500,000. Minimum required down payment is $${minimumRequiredDownPayment.toFixed(
            2
          )}.`
        );
      }
    }

    if (this.downPayment >= this.propertyPrice * 0.8) {
      throw new Error(
        `Down payment must be less than 80% of the property price. Your down payment should be smaller than $${
          this.propertyPrice * 0.8
        }.`
      );
    }

    if (this.downPayment < this.propertyPrice * 0.05) {
      throw new Error(
        `Down payment must be at least 5% of the property price. Minimum required down payment is $${
          this.propertyPrice * 0.05
        }.`
      );
    }

    if (this.annualInterestRate <= 0) {
      throw new Error("Annual interest rate must be greater than 0");
    }
  }

  private calculateCMHC(): number {
    // Checking to see if down payment is 20% or more
    if (this.downPayment / this.propertyPrice >= 0.2) {
      return 0;
    }

    const downPaymentPercentage = this.downPayment / this.propertyPrice;

    // Rates below are driven from the simple CMHC according to https://www.ratehub.ca/cmhc-insurance-british-columbia.
    let premiumRate = 0;
    if (downPaymentPercentage < 0.1) {
      premiumRate = 0.04; // 4.0% for less than 10% down payment
    } else if (downPaymentPercentage < 0.15) {
      premiumRate = 0.031; // 3.1% for 10% - 14.99% down payment
    } else if (downPaymentPercentage < 0.2) {
      premiumRate = 0.028; // 2.8% for 15% - 19.99% down payment
    }

    const mortgageAmount = this.propertyPrice - this.downPayment;

    return mortgageAmount * premiumRate;
  }

  calculateMortgage(): number {
    this.validateInputs();

    const principal =
      this.propertyPrice - this.downPayment + this.calculateCMHC();

    const schedules: { [key: string]: number } = {
      monthly: 12,
      "bi-weekly": 26,
      "accelerated bi-weekly": 12,
    };

    const numberOfPayments =
      this.amortizationPeriod * schedules[this.paymentSchedule];
    const scheduleInterestRate =
      this.annualInterestRate / 100 / schedules[this.paymentSchedule];

    // Mortgage calculation formula according to the pdf file
    let payment =
      (principal *
        scheduleInterestRate *
        Math.pow(1 + scheduleInterestRate, numberOfPayments)) /
      (Math.pow(1 + scheduleInterestRate, numberOfPayments) - 1);

    // For accelerated bi-weekly, the same monthly playment was used and it was devided by 2
    if (this.paymentSchedule === "accelerated bi-weekly") {
      payment = payment / 2;
    }

    return parseFloat(payment.toFixed(2));
  }
}
