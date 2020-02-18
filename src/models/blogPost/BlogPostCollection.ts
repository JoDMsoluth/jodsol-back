import mongoose, { Model, Schema } from "mongoose";
import BlogPostDocument from "./BlogPostDocument";

export const BlogPostSchema: Schema = new Schema(
  {
    coverImg: String,
    title: String,
    markdown: String,
    tags: [String],
    category: String,
    likes: Number,
    series: { type: mongoose.Schema.Types.ObjectId, ref: "Series" },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comments" }]
  },
  { timestamps: true }
);

const BlogPostCollection: Model<BlogPostDocument> = mongoose.model(
  "BlogPost",
  BlogPostSchema
);

export default BlogPostCollection;
