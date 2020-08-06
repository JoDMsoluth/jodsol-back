import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Joi from "joi";
import CommentDocument from "../../../../models/comments/CommentsDocument";
import CommentCollection from "../../../../models/comments/CommentsCollection";
import BlogPostCollection from "../../../../models/blogPost/BlogPostCollection";

async function loadComments(req: Request, res: Response) {
  const { id } = req.params;
  try {
    await CommentCollection.find({ targetId: id })
      .populate("childId")
      .exec((err, comments) => {
        if (err) console.error(err);
        res.json(comments);
      });
  } catch (err) {
    console.error(err);
  }
}

async function addComment(req: Request, res: Response) {
  const schema: Joi.ObjectSchema = Joi.object().keys({
    userId: Joi.string().required(),
    password: Joi.string().required(),
    content: Joi.string().required(),
  });
  const joiResult: Joi.ValidationResult<any> = Joi.validate(req.body, schema);
  if (joiResult.error) {
    res.status(400).send(joiResult.error);
    console.log(joiResult.error);
    return;
  }

  const { id } = req.params;
  const { userId, password, content } = req.body;
  const hashedPassword = await bcrypt.hash(String(password), 12);
  try {
    await BlogPostCollection.findById(id)
      .populate({ path: "comments" })
      .exec((err, target) => {
        if (err) console.error(err);
        if (target) {
          const newComment: CommentDocument = new CommentCollection({
            userId,
            password: hashedPassword,
            content,
            targetId: id,
          });
          target.comments.unshift(newComment._id);
          target.save();
          newComment.save();
          console.log(newComment, " is registed");
          res.json(newComment);
        }
      });
  } catch (e) {
    console.log(e);
  }
}

async function deleteComment(req: Request, res: Response) {
  const { id } = req.params;
  const { password } = req.body;
  console.log("password", password);
  try {
    await CommentCollection.findByIdAndRemove(id, (err, result) => {
      if (err) console.error(err);
      res.json(id); // No Content
    });
  } catch (e) {
    console.error(e);
  }
}
async function updateComment(req: Request, res: Response) {
  const { id } = req.params;

  const schema: Joi.ObjectSchema = Joi.object().keys({
    userId: Joi.string().required(),
    password: Joi.string().required(),
    content: Joi.string().required(),
  });

  const joiResult: Joi.ValidationResult<any> = Joi.validate(req.body, schema);
  if (joiResult.error) {
    res.status(400).send(joiResult.error);
    return;
  }

  try {
    const newComment: CommentDocument | null = await CommentCollection.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    ).exec(); // new:true => 업데이트 된 데이터 반환
    if (!newComment) {
      res.status(404).send("not found");
      return;
    }
    console.log(newComment);
    res.json(newComment);
  } catch (e) {
    console.error(e);
  }
}

const CommentController = {
  addComment,
  deleteComment,
  updateComment,
  loadComments,
};

export default CommentController;
