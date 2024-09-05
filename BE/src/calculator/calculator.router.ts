import { Router } from "express";
import { handleCalculateMortgage } from "./calculator.controller";

const router = Router();

router.post("/calculate", handleCalculateMortgage);

export default router;
