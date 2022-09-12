import express from "express";
import {auth} from "../middlewares/auth.middleware.js";
import {getUser, validate} from "../middlewares/wallet.middleware.js";
import {
  createTransaction,
  editTransaction,
  listTransactions,
  removeTransaction,
} from "../controllers/wallet.controller.js";

const router = express.Router();

router.use(auth);
router.use(getUser);
router.get("/transaction", listTransactions);
router.delete("/transaction", removeTransaction);

router.use(validate);
router.post("/transaction", createTransaction);
router.put("/transaction", editTransaction);

export default router;
