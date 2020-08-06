import { Request, Response } from "express";
import BlogPostCollection from "../../../../models/blogPost/BlogPostCollection";
import BlogPostDocument from "../../../../models/blogPost/BlogPostDocument";
import { removeHtmlAndShorten } from "../../../../lib/sanitizeHtml";
import SeriesCollection from "../../../../models/series/SeriesCollection";
import SeriesDocument from "../../../../models/series/SeriesDocument";

async function loadAllPosts(req: Request, res: Response) {
  console.log("getAllPost");
  const page: number = parseInt(req.query.page || "1", 10);
  const { tag, series } = req.query;
  const { category } = req.params;
  const { filter } = req.params;
  console.log(
    "page tag series popular latest category filter",
    page,
    tag,
    series,
    category,
    filter
  );
  if (page < 1) {
    res.status(400).send("bad request");
    console.log("bad request");
    return;
  }
  try {
    const getPosts: BlogPostDocument[] | null =
      filter === "latest"
        ? await BlogPostCollection.find()
            .where("category")
            .equals(category)
            .sort({ createdAt: -1 })
            .limit(9)
            .skip((page - 1) * 9)
            .lean()
            .exec()
        : filter === "popular"
        ? await BlogPostCollection.find()
            .where("category")
            .equals(category)
            .sort({ likes: -1 })
            .limit(9)
            .skip((page - 1) * 9)
            .lean()
            .exec()
        : await BlogPostCollection.find()
            .where("category")
            .equals(category)
            .sort({ _id: -1 })
            .limit(9)
            .skip((page - 1) * 9)
            .lean()
            .exec();
    const postCount: number = await BlogPostCollection.countDocuments().exec();
    res.set("Last-Page", Math.ceil(postCount / 9).toString());
    getPosts.map((post) => ({
      ...post,
      markdown: removeHtmlAndShorten(post.markdown),
    }));
    res.json(getPosts);
  } catch (e) {
    console.error(e);
  }
}

async function loadSeriesPosts(req: Request, res: Response) {
  const page: number = parseInt(req.query.page || "1", 10);
  const { id } = req.query;

  const { category } = req.params;
  console.log("page tag series popular latest category filter", page, category);

  if (page < 1) {
    res.status(400).send("bad request");
    console.log("bad request");
    return;
  }
  try {
    const getSeries: SeriesDocument | null = await SeriesCollection.findById(id)
      .populate("posts")
      .where("category")
      .equals(category)
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .lean()
      .exec();
    const postCount: number = await SeriesCollection.countDocuments().exec();
    res.set("Last-Page", Math.ceil(postCount / 10).toString());
    console.log(getSeries);
    res.json(getSeries);
  } catch (e) {
    console.error(e);
  }
}

async function loadTags(req: Request, res: Response) {
  const tag: string = req.query.tag;

  const { category } = req.params;
  console.log("tag category", tag, category);

  try {
    const hashtags: BlogPostDocument[] | null = await BlogPostCollection.find({
      category,
    })
      .select("tags")
      .sort({ tags: 1 })
      .distinct("tags")
      .lean()
      .exec();
    res.set("Last-Page", "1");
    console.log(hashtags);
    res.json(hashtags);
  } catch (e) {
    console.error(e);
  }
}

async function loadPostsInTag(req: Request, res: Response) {
  const { category, tag } = req.params;
  const page: number = parseInt(req.query.page || "1", 10);
  if (page < 1 || !tag) {
    res.status(400).send("bad request");
    console.log("bad request");
    return;
  }

  try {
    const getPostsInTag:
      | BlogPostDocument[]
      | null = await BlogPostCollection.find({ tags: { $in: `#${tag}` } })
      .where("category")
      .equals(category)
      .sort({ _id: -1 })
      .limit(9)
      .skip((page - 1) * 9)
      .lean()
      .exec();
    const postCount: number = await BlogPostCollection.find({
      tags: { $in: `#${tag}` },
    })
      .countDocuments()
      .exec();
    res.set("Last-Page", Math.ceil(postCount / 9).toString());
    console.log(getPostsInTag);
    res.json(getPostsInTag);
  } catch (e) {
    console.error(e);
  }
}

async function searchPosts(req: Request, res: Response) {
  console.log("getSearchPost");
  const { q, page } = req.query;
  const { category, filter } = req.params;

  const searchRegExp = new RegExp(q, "g");

  console.log(q, page, "p and page");
  if (page < 1 || !q) {
    res.status(400).send("bad request");
    console.log("bad request");
    return;
  }
  try {
    const getPosts: BlogPostDocument[] | null =
      filter === "latest"
        ? await BlogPostCollection.find({ title: { $regex: searchRegExp } })
            .where("category")
            .equals(category)
            .sort({ createdAt: -1 })
            .limit(9)
            .skip((page - 1) * 9)
            .lean()
            .exec()
        : filter === "popular"
        ? await BlogPostCollection.find({ title: { $regex: searchRegExp } })
            .where("category")
            .equals(category)
            .sort({ likes: -1 })
            .limit(9)
            .skip((page - 1) * 9)
            .lean()
            .exec()
        : await BlogPostCollection.find({ title: { $regex: searchRegExp } })
            .where("category")
            .equals(category)
            .sort({ _id: -1 })
            .limit(9)
            .skip((page - 1) * 9)
            .lean()
            .exec();
    const postCount: number = await BlogPostCollection.countDocuments().exec();
    res.set("Last-Page", Math.ceil(postCount / 9).toString());
    getPosts.map((post) => ({
      ...post,
      markdown: removeHtmlAndShorten(post.markdown),
    }));
    res.json(getPosts);
  } catch (e) {
    console.error(e);
  }
}

const postsController = {
  loadAllPosts,
  loadSeriesPosts,
  loadTags,
  loadPostsInTag,
  searchPosts,
};

export default postsController;
