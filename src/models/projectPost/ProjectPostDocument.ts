import { Document } from "mongoose";
import { PostModel } from "../../types/types.d";

export default interface BlogPostDocument extends Document, PostModel {
  desc: string;
}
