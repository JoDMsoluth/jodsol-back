import { Router } from "express";
import adminApi from "./admin";

const userApi = Router();

userApi.use("/admin", adminApi);

export default userApi;
