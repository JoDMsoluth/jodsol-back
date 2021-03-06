import { Document } from "mongoose";
import { PostModel } from "../../types/types.d";
import SeriesDocument from "../series/SeriesDocument";
import CommentsDocument from "../comments/CommentsDocument";

export default interface BlogPostDocument extends Document, PostModel {
  tags: string[];
  likes: number;
  comments: any[];
}
