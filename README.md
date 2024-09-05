# **Mortgage Calculator Assessment**

This project consists of a front-end application built with React and TypeScript and a back-end API built with Express. This README provides instructions on how to set up and run both parts of the project.

## **Prerequisites**

Before you begin, ensure you have the following software installed on your machine:

- [Node.js](https://nodejs.org/) (includes npm)

## **Setting Up the Back-End**

**Navigate to the back-end directory:** cd path/to/your/backend

**Install the required dependencies:** npm install

**Start the back-end server:** npm run dev

The server should start and listen on port 3001 by default. You can change the port by setting the PORT environment variable.

**Test the back-end server:** npm test

The server should run all the automated unit tests.

## **Setting Up the Front-End**

**Navigate to the front-end directory:** cd path/to/your/frontend

**Install the required dependencies:** npm install

**Start the front-end development server:** npm start

The front-end server should start and be available at http://localhost:3000 by default.

## **Endpoints**

### **POST /calculate**

**Request Body:**
{

"propertyPrice": 300000,

"downPayment": 40000,

"annualInterestRate": 3.5,

"amortizationPeriod": 25,

"paymentSchedule": "monthly"

}

**Response:**
{

"payment": 1360.5

}

**Error Response:** 
{

"error": "Down payment must be at least 5% of the property price"

}
