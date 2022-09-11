import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import authRouter from "./routers/auth.router.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// TODO: implement
app.use(authRouter);
// app.use(walletRouter);

const port = process.env.PORT;
app.listen(port, () =>
  console.log(`Magic happens @ http://localhost:${port}...`)
);
