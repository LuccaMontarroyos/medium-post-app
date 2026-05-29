import { Router } from "express";
import MetricsController from "../controllers/MetricsController";

const metricRoutes = new Router();

routes.get("/", MetricsController.index);


export default metricRoutes;