import { Router } from "express";
import blogPostsController from "./blogPostsController";
const postsApi = Router();

//read
postsApi.get("/load/:category/series", blogPostsController.loadSeriesPosts);
//read
postsApi.get("/load/:category/tags", blogPostsController.loadTags);
//read
postsApi.get("/load/:category/:filter?", blogPostsController.loadAllPosts);
//read
postsApi.get("/load/:category/tags/:tag", blogPostsController.loadPostsInTag);
//read
postsApi.get("/search/:category/:filter", blogPostsController.searchPosts);

export default postsApi;
