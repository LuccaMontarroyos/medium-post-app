import { Router, json as jsonParser } from "express";
import SessionController from "../controllers/SessionController.js";

const sessionRoutes = new Router();

sessionRoutes.post("/login", jsonParser(), SessionController.store);

export default sessionRoutes;