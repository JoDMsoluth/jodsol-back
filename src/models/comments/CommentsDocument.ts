import { Document } from "mongoose";
import { UnifiedModel } from "../../types/types.d";

export default interface CommentsDocument extends Document, UnifiedModel {
  userId: string;
  password: string;
  content: string;
  targetId: String;
  childId: any[];
  likes: number;
}
