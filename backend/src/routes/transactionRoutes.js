import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionMonths,
} from "../controllers/transactionController.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getTransactions);
router.get("/months", requireAuth, getTransactionMonths);
router.post("/", createTransaction);
router.patch("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
