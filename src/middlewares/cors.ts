import { NextFunction, Request, Response } from "express";
import { allowedDomains } from "../config";

const cors = (req: Request, res: Response, next: NextFunction) => {
  const domains = allowedDomains;
  domains.forEach((d) => {
    res.setHeader("Access-Control-Allow-Origin", d);
  });

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  next();
};

export { cors };
