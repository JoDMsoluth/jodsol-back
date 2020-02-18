import { Request, Response } from "express";
import Joi from "joi";
import ReCommentsDocument from "models/recomments/ReCommentsDocument";
import ReCommentsCollection from "models/recomments/ReCommentsCollection";
import CommentsCollection from "models/comments/CommentsCollection";


async function addComment(req: Request, res: Response) {
  const schema: Joi.ObjectSchema = Joi.object().keys({
    userId: Joi.string().required(),
    password: Joi.string().required(),
    content: Joi.string().required()
  });
  const joiResult: Joi.ValidationResult<any> = Joi.validate(req.body, schema);
  if (joiResult.error) {
    res.status(400).send(joiResult.error);
    console.log(joiResult.error);
    return;
  }

  const { id } = req.params;
  const { userId, password, content } = req.body;
  try {
    await CommentsCollection.findById(id)
      .populate("childId")
      .exec(function(err, target) {
        console.log(target);
        if (err) console.error(err);
        if (target) {
          const newComment: ReCommentsDocument = new ReCommentsCollection({
            userId,
            password,
            content,
            targetId: id
          });
          target.childId.unshift(newComment._id);
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
  try {
    await ReCommentsCollection.findByIdAndRemove(id, function(err, result) {
      if (err) console.error(err);
      console.log(result)
      res.json(result)
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
    content: Joi.string().required()
  });

  const joiResult: Joi.ValidationResult<any> = Joi.validate(req.body, schema);
  if (joiResult.error) {
    res.status(400).send(joiResult.error);
    return;
  }

  try {
    const newComment: ReCommentsDocument | null = await ReCommentsCollection.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true
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
};

export default CommentController;
