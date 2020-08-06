import { Request, Response } from "express";
import ProjectPostCollection from "../../../models/projectPost/ProjectPostCollection";
import ProjectPostDocument from "../../../models/projectPost/ProjectPostDocument";
import Joi from "joi";
import sanitizeHtml from "sanitize-html";
import { sanitizeOption } from "../../../lib/sanitizeHtml";

//readAll
export async function loadAllPost(req: Request, res: Response) {
  const { category } = req.params;
  let getPost: ProjectPostDocument[] | null = null;
  try {
    if (category === "all") {
      getPost = await ProjectPostCollection.find()
        .sort({ createdAt: -1 })
        .limit(9)
        .lean()
        .exec();
    } else {
      getPost = await ProjectPostCollection.find({ category }).exec();
    }
    console.log(getPost);
    res.json(getPost);
  } catch (e) {
    console.error(e);
  }
}
//read
export async function loadPost(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const getPost: ProjectPostDocument | null = await ProjectPostCollection.findById(
      id
    ).exec();
    if (!getPost) {
      res.status(404);
      return;
    }
    console.log(getPost);
    res.json(getPost);
  } catch (e) {
    console.error(e);
  }
}
//write
export async function addPost(req: Request, res: Response) {
  const { category } = req.params;
  const schema: Joi.ObjectSchema = Joi.object().keys({
    coverImg: Joi.string(),
    title: Joi.string().required(),
    markdown: Joi.string().required(),
    desc: Joi.string(),
  });

  const joiResult: Joi.ValidationResult<any> = Joi.validate(req.body, schema);
  if (joiResult.error) {
    res.status(400).send(joiResult.error);
    console.log(joiResult.error);
    return;
  }
  console.log("newPost");

  const { title, markdown, desc } = req.body;

  try {
    const newPost: ProjectPostDocument = await ProjectPostCollection.create({
      coverImg: "",
      title,
      markdown: sanitizeHtml(markdown, sanitizeOption),
      desc,
      category,
    });
    newPost.save();
    res.json(newPost);
  } catch (e) {
    console.log(e);
  }
}
//delete
export async function deletePost(req: Request, res: Response) {
  const { id } = req.params;
  try {
    await ProjectPostCollection.findByIdAndRemove(id).exec();
    res.status(204); // No Content
  } catch (e) {
    console.error(e);
  }
}
//update
export async function updatePost(req: Request, res: Response) {
  const { id } = req.params;
  const schema: Joi.ObjectSchema = Joi.object().keys({
    coverImg: Joi.string(),
    title: Joi.string(),
    markdown: Joi.string(),
    tags: Joi.string(),
  });

  const joiResult: Joi.ValidationResult<any> = Joi.validate(req.body, schema);
  if (joiResult.error) {
    res.status(400).send(joiResult.error);
    return;
  }

  const updateData = Object.assign({}, req.body);
  if (updateData.body) {
    updateData.body = sanitizeHtml(updateData.body);
  }
  try {
    const newPost: ProjectPostDocument | null = await ProjectPostCollection.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      }
    ).exec(); // new:true => 업데이트 된 데이터 반환
    if (!newPost) {
      res.status(404).send("not found");
      return;
    }
    console.log(newPost);
    res.json(newPost);
  } catch (e) {
    console.error(e);
  }
}

const projectPostController = {
  loadPost,
  addPost,
  deletePost,
  updatePost,
  loadAllPost,
};

export default projectPostController;
