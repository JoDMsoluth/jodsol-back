import { Model, Document } from "mongoose";

enum PostType {
  POST = "post",
  POSTS = "posts",
  COMMENT = "comments",
}

export default PostType;
