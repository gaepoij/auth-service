import { NextFunction, Request, Response } from "express";
import { User } from "../database/user";
import { BadRequest, Conflict } from "http-errors";
import bcrypt from "bcrypt";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // check if user already exists
    const { username, password } = req.body;

    if (!username || !password) throw new BadRequest();

    const exists = (await User.query().where("username", username)).length;
    if (exists) throw new Conflict("user already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.query().insert({
      username: username,
      password: hashedPassword,
    });

    res.status(201).send();
  } catch (e) {
    return next(e);
  }
};

export { registerUser };
