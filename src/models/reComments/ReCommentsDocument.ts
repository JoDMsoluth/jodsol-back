import { Document } from "mongoose";
import { UnifiedModel } from "types/types.d";

export default interface ReCommentsDocument extends Document, UnifiedModel {
  userId: string;
  password: string;
  content: string;
  targetId: string;
}
