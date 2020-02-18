import { Document } from "mongoose";
import { UnifiedModel } from "types/types.d";

export default interface ViewsDocument extends Document, UnifiedModel {
  todayViews: number;
  createAt: string;
}
