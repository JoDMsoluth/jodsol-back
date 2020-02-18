import { Router } from "express";
import commentsController from "./commentsController";
import { checkObjectId } from "lib/middlewares/checkObjectId";
import checkPassword from "lib/middlewares/checkPasswrod";
const commentApi = Router();

//read
commentApi.get("/load/:id", checkObjectId, commentsController.loadComments);
//write
commentApi.post("/add/:id", checkObjectId, commentsController.addComment);
//delete
commentApi.post(
  "/delete/:id",
  checkObjectId,
  checkPassword.checkCommentsPassword,
  commentsController.deleteComment
);
//update
commentApi.patch(
  "/update/:id",
  checkObjectId,
  checkPassword.checkCommentsPassword,
  commentsController.updateComment
);

export default commentApi;
