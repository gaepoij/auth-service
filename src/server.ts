import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import { initDb } from "./database";
import { cors } from "./middlewares/cors";

require("dotenv").config();

const app = express();

app.use(cookieParser());
app.use(cors);
app.use(express.json());

app.use("/auth", authRouter);

initDb();

app.listen(4011, () => {
  console.log("running on port 4011");
});
