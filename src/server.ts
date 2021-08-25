import express, { Request, Response } from "express";
import authRouter from "./routes/auth";
import { initDb } from "./database";

const app = express();

app.use(express.json());
app.use("/auth", authRouter);

initDb();

app.listen(4011, () => {
  console.log("running on port 4011");
});
