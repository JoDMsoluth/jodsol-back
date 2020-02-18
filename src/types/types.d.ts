export type category = undefined | "study" | "daily" | "game";

export interface UnifiedModel {
  _id: any;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export interface PostModel extends UnifiedModel {
  coverImg: string;
  title: string;
  markdown: string;
  category: category;
}
