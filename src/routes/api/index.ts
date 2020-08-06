import { Router } from "express";
import blogApi from "./blog";
import projectApi from "./project";
import { countVisitor } from "../../lib/middlewares/countVisitor";
import viewsApi from "./views";
import emailApi from "./email";
import userApi from "./user";

const api = Router();

api.use("/blog", countVisitor, blogApi);
api.use("/project", countVisitor, projectApi);
api.use("/views", viewsApi);
api.use("/email", emailApi);
api.use("/user", userApi);

export default api;
