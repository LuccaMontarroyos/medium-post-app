import { Router } from "express";
import postRoutes from "./postRoutes.js";
import userRoutes from "./userRoutes.js";
import sessionRoutes from "./sessionRoutes.js";
import metricRoutes from "./metricRoutes.js";


const routes = new Router();

routes.use(sessionRoutes);

routes.use("/users", userRoutes);

routes.use("/posts", postRoutes);

routes.use("/metrics", metricRoutes);

export default routes;
