import { Schema, Model } from "mongoose";
import mongoose from "configs/mongodb";
import SeriesDocument from "./SeriesDocument";

export const SeriesSchema: Schema = new Schema(
  {
    coverImg: String,
    title: String,
    desc: String,
    markdown: String,
    category: { type: String, default: "study" },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" }]
  },
  { timestamps: true }
);

const SeriesCollection: Model<SeriesDocument> = mongoose.model(
  "Series",
  SeriesSchema
);

export default SeriesCollection;
