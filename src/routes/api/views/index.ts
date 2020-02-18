import { Router } from "express";
import ViewsController from "./viewsController";
const viewsApi = Router();

//read
viewsApi.get("/load", ViewsController.loadViews);
viewsApi.get("/add", ViewsController.addViews);

export default viewsApi;
