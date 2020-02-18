import { Router } from "express";
import AdminController from "./adminController";
const adminApi = Router();

//read
adminApi.post("/login", AdminController.login);

export default adminApi;
