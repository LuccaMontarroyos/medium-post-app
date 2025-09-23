import { Router } from "express";
import postRoutes from "./postRoutes.js";
import userRoutes from "./userRoutes.js";
import sessionRoutes from "./sessionRoutes.js";


const routes = new Router();

routes.use(sessionRoutes);

routes.use("/users", userRoutes);

routes.use("/posts", postRoutes);

export default routes;
