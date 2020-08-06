import { NextFunction, Request, Response } from "express";
import ViewsCollection from "../../models/views/ViewsCollection";
import ViewsDocument from "../../models/views/ViewsDocument";
import moment from "moment";

export const countVisitor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.cookies.vwctck) {
    return next();
  } else {
    const day: number = 60 * 60 * 24 * 1000;
    const nowDate = moment(Date.now()).format("YYYY-MM-DD");
    console.log(req.cookies);
    res.cookie("vwctck", true, {
      maxAge: day,
      expires: new Date(Date.now() + day),
    });
    try {
      const newPost: ViewsDocument | null = await ViewsCollection.findOneAndUpdate(
        { createAt: nowDate },
        {
          $inc: { todayViews: 1 },
        },
        { new: true }
      ).exec(); // new:true => 업데이트 된 데이터 반환
      if (!newPost) {
        console.log("not found");
      }
    } catch (e) {
      next(e);
    }
  }
  return next();
};
