import { Request, Response } from "express";
import BlogPostCollection from "models/blogPost/BlogPostCollection";
import BlogPostDocument from "models/blogPost/BlogPostDocument";
import Joi from "joi";
import sanitizeHtml from "sanitize-html";
import { sanitizeOption } from "lib/sanitizeHtml";
import dbPropIncrease from "lib/dbPropIncrease";
import SeriesCollection from "models/series/SeriesCollection";

//read
export async function loadPost(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const getPost: BlogPostDocument | null = await BlogPostCollection.findById(
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
  const { category, id } = req.params;
  const schema: Joi.ObjectSchema = Joi.object().keys({
    coverImg: Joi.string(),
    title: Joi.string().required(),
    markdown: Joi.string().required(),
    desc: Joi.string().required(),
    tags: Joi.string()
  });

  const joiResult: Joi.ValidationResult<any> = Joi.validate(req.body, schema);
  if (joiResult.error) {
    res.status(400).send(joiResult.error);
    console.log(joiResult.error);
    return;
  }
  console.log("newPost");

  const { title, markdown, tags, coverImg, desc } = req.body;
  const hashtags: string[] = tags.match(/#[^\s]+/g);
  const newPost: BlogPostDocument = await BlogPostCollection.create({
    coverImg,
    desc,
    title,
    markdown: sanitizeHtml(markdown, sanitizeOption),
    tags: hashtags,
    category,
    likes: 0
  });
  try {
    await SeriesCollection.findById(id, (err, getSeries) => {
      if (err) console.error(err);
      if (getSeries) {
        getSeries.posts.push(newPost);
        getSeries.save();
        newPost.save();
        res.json(newPost);
      }
    });
  } catch (e) {
    console.log(e);
  }
}
//delete
export async function deletePost(req: Request, res: Response) {
  const { id } = req.params;
  try {
    await BlogPostCollection.findByIdAndRemove(id).exec();
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
    tags: Joi.string()
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
    const newPost: BlogPostDocument | null = await BlogPostCollection.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true
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

//like
export async function likePost(req: Request, res: Response) {
  const day: number = 60 * 60 * 24 * 1000;
  const { id } = req.params;
  console.log("id", id);
  if (req.hasOwnProperty(id)) {
    res.json("cookie exist");
    return;
  }
  res.cookie(id, true, {
    maxAge: day,
    expires: new Date(Date.now() + day)
  });
  const result = await dbPropIncrease(id, "likes", 1);
  res.json(result);
}

//unlike
export async function unlikePost(req: Request, res: Response) {
  const { id } = req.params;
  console.log("id",id);

  if (!req.cookies[id]) {
    res.json("cookie not exist");
    return;
  }
  res.clearCookie(id);
  const result = await dbPropIncrease(id, "likes", -1);
  res.json(result);
}

export async function uploadThumbnail(req: Request, res: Response) {
  res.json(req.file.filename);
}

const postController = {
  loadPost,
  addPost,
  deletePost,
  updatePost,
  likePost,
  unlikePost,
  uploadThumbnail
};

export default postController;
