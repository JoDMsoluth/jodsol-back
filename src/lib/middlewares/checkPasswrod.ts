import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import CommentsDocument from "models/comments/CommentsDocument";
import CommentsCollection from "models/comments/CommentsCollection";
import ReCommentsDocument from "models/recomments/ReCommentsDocument";
import ReCommentsCollection from "models/recomments/ReCommentsCollection";

export const checkCommentsPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const getComment: null | CommentsDocument = await CommentsCollection.findOne(
      { _id: id }
    ).exec(function(err, result) {
      if (err) {
        console.error(err);
        return;
      }
      if (result) {
        bcrypt
          .compare(password, result.password)
          .then(result => {
            console.log("result", result);
            return next();
          })
          .catch(e => {
            console.error(e);
            return;
          });
      }
    });
    console.error("bad request");
    return;
  } catch (e) {
    console.error(e);
    return;
  }
};
export const checkReCommentsPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const getComment: null | ReCommentsDocument = await ReCommentsCollection.findOne(
      { _id: id }
    ).exec(function(err, result) {
      if (err) {
        console.error(err);
        return;
      }
      if (result) {
        bcrypt
          .compare(password, result.password)
          .then(result => {
            console.log("result", result);
            return next();
          })
          .catch(e => {
            console.error(e);
            return;
          });
      }
    });
    console.error("bad request");
    return;
  } catch (e) {
    console.error(e);
    return;
  }
};

const checkPassword = {
  checkCommentsPassword,
  checkReCommentsPassword
};

export default checkPassword;
