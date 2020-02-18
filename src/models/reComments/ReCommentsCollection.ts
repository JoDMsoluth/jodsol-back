import { Schema, Model } from "mongoose";
import mongoose from "configs/mongodb";
import ReCommentsDocument from "./ReCommentsDocument";

const ReCommentsSchema: Schema = new Schema(
  {
    userId: String,
    password: String,
    content: String,
    targetId: String
    // comment_id
  },
  { timestamps: true }
);

const ReCommentsCollection: Model<ReCommentsDocument> = mongoose.model(
  "ReComments",
  ReCommentsSchema
);

export default ReCommentsCollection;
