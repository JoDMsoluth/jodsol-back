import { Router } from "express";
import { checkObjectId } from "lib/middlewares/checkObjectId";
import seriesController from "./seriesController";
const seriesApi = Router();

//read
seriesApi.get("/loadAll/:category", seriesController.loadSeries);
seriesApi.get("/load/:id", checkObjectId, seriesController.loadSeriesPosts);
//write
seriesApi.post("/add/:category", seriesController.addSeries);
//delete
seriesApi.delete("/delete/:id", checkObjectId, seriesController.deleteSeries);
//update
seriesApi.patch("/update/:id", checkObjectId, seriesController.updateSeries);

export default seriesApi;
