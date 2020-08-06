import { Router } from "express";
import { checkObjectId } from "../../../lib/middlewares/checkObjectId";
import projectPostController from "./projectPostController";
const postApi = Router();

//readAll
postApi.get("/loadAll/:category", projectPostController.loadAllPost);
//read
postApi.get("/load/:id", checkObjectId, projectPostController.loadPost);
//add
postApi.post("/add/:category", projectPostController.addPost);
//delete
postApi.delete("/delete/:id", checkObjectId, projectPostController.deletePost);
//update
postApi.patch("/update/:id", checkObjectId, projectPostController.updatePost);

export default postApi;
