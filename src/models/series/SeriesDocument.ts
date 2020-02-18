import { Document } from "mongoose";
import { UnifiedModel, category } from "types/types.d";

export default interface SeriesDocument extends Document, UnifiedModel {
  coverImg: string;
  title: string;
  desc: string;
  markdown: string;
  category: category;
  posts: any[];
}
