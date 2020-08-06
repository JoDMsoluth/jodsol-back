import { Request, Response } from "express";
import Joi from "joi";
import SeriesDocument from "../../../../models/series/SeriesDocument";
import SeriesCollection from "../../../../models/series/SeriesCollection";
import sanitizeHtml from "sanitize-html";
import { sanitizeOption } from "../../../../lib/sanitizeHtml";

async function addSeries(req: Request, res: Response) {
  const schema: Joi.ObjectSchema = Joi.object().keys({
    coverImg: Joi.string(),
    title: Joi.string().required(),
    markdown: Joi.string().required(),
    desc: Joi.string().required(),
  });
  const joiResult: Joi.ValidationResult<any> = Joi.validate(req.body, schema);
  if (joiResult.error) {
    res.status(400).send(joiResult.error);
    console.log(joiResult.error);
    return;
  }

  const { category } = req.params;
  const { coverImg, title, desc, markdown } = req.body;

  const newSeries: SeriesDocument = new SeriesCollection({
    coverImg,
    title,
    desc,
    markdown: sanitizeHtml(markdown, sanitizeOption),
    category,
  });

  console.log(newSeries);
  try {
    await newSeries.save((err, newSeries) => {
      if (err) return console.error(err);
      console.log(newSeries, " is registed");
      res.json(newSeries);
    });
  } catch (e) {
    console.log(e);
  }
}
async function deleteSeries(req: Request, res: Response) {
  const { id } = req.params;
  try {
    await SeriesCollection.findByIdAndRemove(id).exec((err, result) => {
      if (err) console.error(err);
      res.json(result && result._id);
    });
  } catch (e) {
    console.error(e);
  }
}
async function updateSeries(req: Request, res: Response) {
  const { id } = req.params;
  // const a = JSON.parse(req.body);
  // res.send(a);
  // return;
  const schema: Joi.ObjectSchema = Joi.object().keys({
    coverImg: Joi.string(),
    title: Joi.string(),
    desc: Joi.string(),
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
    const newSeries: SeriesDocument | null = await SeriesCollection.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      }
    ).exec(); // new:true => 업데이트 된 데이터 반환
    if (!newSeries) {
      res.status(404).send("not found");
      return;
    }
    console.log(newSeries);
    res.json(newSeries);
  } catch (e) {
    console.error(e);
  }
}
async function loadSeriesPosts(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const getPostsInSeries: SeriesDocument | null = await SeriesCollection.findById(
      id
    )
      .populate("posts")
      .exec();
    console.log(getPostsInSeries);
    res.json(getPostsInSeries);
  } catch (e) {
    console.error(e);
  }
}

async function loadSeries(req: Request, res: Response) {
  const page: number = parseInt(req.query.page || "1", 10);
  const { series } = req.query;

  const { category } = req.params;
  console.log(
    "page tag series popular latest category filter",
    page,
    series,
    category
  );

  if (page < 1) {
    res.status(400).send("bad request");
    console.log("bad request");
    return;
  }
  try {
    const getSeries: SeriesDocument[] | null = await SeriesCollection.find()
      .where("category")
      .equals(category)
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 6)
      .lean()
      .exec();
    const postCount: number = await SeriesCollection.countDocuments().exec();
    res.set("Last-Page", Math.ceil(postCount / 6).toString());
    console.log(getSeries);
    res.json(getSeries);
  } catch (e) {
    console.error(e);
  }
}

const seriesController = {
  addSeries,
  deleteSeries,
  updateSeries,
  loadSeries,
  loadSeriesPosts,
};

export default seriesController;
