import { Router, json as jsonParser } from "express";
import UserController from "../controllers/UserController.js";
import authMiddleware from "../middlewares/auth.js";
import SchemaValidator from "../middlewares/SchemaValidator.js";
import { userCreateSchema, userUpdateSchema } from "../schemas/UserSchema.js";

const userRoutes = new Router();

userRoutes.post("/", jsonParser(), SchemaValidator.validate(userCreateSchema), UserController.store);

userRoutes.put("/", authMiddleware, jsonParser(), SchemaValidator.validate(userUpdateSchema), UserController.update);

export default userRoutes;