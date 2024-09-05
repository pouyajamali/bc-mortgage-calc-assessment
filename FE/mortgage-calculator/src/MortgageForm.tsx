import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Alert,
  Box,
  MenuItem,
} from "@mui/material";
import axios from "axios";

const MortgageForm: React.FC = () => {
  const [propertyPrice, setPropertyPrice] = useState<number | string>(0);
  const [downPayment, setDownPayment] = useState<number | string>(0);
  const [annualInterestRate, setAnnualInterestRate] = useState<number | string>(
    0
  );
  const [amortizationPeriod, setAmortizationPeriod] = useState<number | string>(
    5
  );
  const [paymentSchedule, setPaymentSchedule] = useState<string>("monthly");
  const [payment, setPayment] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/calculate", {
        propertyPrice: Number(propertyPrice),
        downPayment: Number(downPayment),
        annualInterestRate: Number(annualInterestRate),
        amortizationPeriod: Number(amortizationPeriod),
        paymentSchedule,
      });

      setPayment(response.data.payment);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred");
      setPayment(null);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "5rem" }}>
      <Typography variant="h4" gutterBottom>
        Pouya's BC Mortgage Calculator
      </Typography>
      <br />
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Property Price"
              type="number"
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(e.target.value)}
              variant="outlined"
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: 0 }}
              placeholder="0"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Down Payment"
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              variant="outlined"
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: 0 }}
              placeholder="0"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Annual Interest Rate (%)"
              type="number"
              value={annualInterestRate}
              onChange={(e) => setAnnualInterestRate(e.target.value)}
              variant="outlined"
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: 0, step: 0.01 }}
              placeholder="0"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Amortization Period"
              select
              value={amortizationPeriod}
              onChange={(e) => setAmortizationPeriod(Number(e.target.value))} // Convert to number
              fullWidth
              margin="normal"
            >
              {[5, 10, 15, 20, 25, 30].map((period) => (
                <MenuItem key={period} value={period}>
                  {period} years
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Payment Schedule"
              select
              value={paymentSchedule}
              onChange={(e) => setPaymentSchedule(e.target.value)}
              fullWidth
              margin="normal"
            >
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="bi-weekly">Bi-Weekly</MenuItem>
              <MenuItem value="accelerated bi-weekly">
                Accelerated Bi-Weekly
              </MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Calculate
            </Button>
          </Grid>
          {error && (
            <Grid item xs={12}>
              <Box mt={2}>
                <Alert severity="error">{error}</Alert>
              </Box>
            </Grid>
          )}
          {payment !== null && (
            <Grid item xs={12}>
              <Box mt={2}>
                <Alert severity="success">
                  <b>Payment: ${payment.toFixed(2)}</b>
                </Alert>
              </Box>
            </Grid>
          )}
        </Grid>
      </form>
    </Container>
  );
};

export default MortgageForm;
