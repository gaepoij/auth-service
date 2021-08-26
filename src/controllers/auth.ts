import { CookieOptions, NextFunction, Request, Response } from "express";
import { User } from "../database/user";
import { BadRequest, Conflict, Unauthorized } from "http-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
require("dotenv").config();

const accessTokenCookieOpts: CookieOptions = {
  secure: true,
  httpOnly: true,
  sameSite: "lax",
  maxAge: 1 * 60 * 60 * 1000,
};

const refreshTokenCookieOpts: CookieOptions = {
  secure: true,
  httpOnly: true,
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

interface Token {
  id: number;
  iat: number;
  exp: number;
}

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

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const user = (await User.query().where("username", "=", username))[0];
    if (!user) throw new Unauthorized();

    const compareCheck = await bcrypt.compare(password, user.password);
    if (!compareCheck) throw new Unauthorized();

    const accessToken = getAccessToken(user.id);
    const refreshToken = getRefreshToken(user.id);

    res.cookie("hltoken", accessToken, accessTokenCookieOpts);
    res.cookie("hlrtoken", refreshToken, refreshTokenCookieOpts);

    res.status(200).send();
  } catch (e) {
    return next(e);
  }
};

const refreshTokens = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { hlrtoken } = req.cookies;
    if (!hlrtoken) throw new Unauthorized();

    const jwtVerify = jwt.verify(
      hlrtoken,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as Token;

    // Check if refresh token has expired
    if (jwtVerify.exp < new Date().getTime() / 1000) {
      throw new Unauthorized();
    }

    // Token is valid, set new cookies
    const accessToken = getAccessToken(jwtVerify.id);
    const refreshToken = getRefreshToken(jwtVerify.id);

    res.cookie("hltoken", accessToken, accessTokenCookieOpts);
    res.cookie("hlrtoken", refreshToken, refreshTokenCookieOpts);

    res.status(200).send();
  } catch (e) {
    throw new Unauthorized();
  }
};

const getRefreshToken = (userId: number) => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: `${7 * 24 * 3600}s`,
  });
};

const getAccessToken = (userId: number) => {
  return jwt.sign({ uid: userId }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "3600s",
  });
};

export { registerUser, login, refreshTokens };
