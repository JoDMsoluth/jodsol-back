import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";

const { ObjectId } = mongoose.Types;

export const checkObjectId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.status(400).send("bad request");
    return;
  }
  return next();
};
