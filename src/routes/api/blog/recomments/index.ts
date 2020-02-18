import { Router } from "express";
import { checkObjectId } from "lib/middlewares/checkObjectId";
import reCommentController from "./reCommentsController";
import checkPassword from "lib/middlewares/checkPasswrod";

const reCommentApi = Router();

//write
reCommentApi.post("/add/:id", checkObjectId, reCommentController.addComment);
//delete
reCommentApi.post(
  "/delete/:id",
  checkObjectId,
  checkPassword.checkReCommentsPassword,
  reCommentController.deleteComment
);
//update
reCommentApi.patch(
  "/update/:id",
  checkObjectId,
  checkPassword.checkReCommentsPassword,
  reCommentController.updateComment
);

export default reCommentApi;
