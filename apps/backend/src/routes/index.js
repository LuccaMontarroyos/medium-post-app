import { Router } from "express";
import { upload } from "../config/multer.js";

import PostController from "../controllers/PostController.js";
import UserController from "../controllers/UserController.js";
import LikeController from "../controllers/LikeController.js";
import SessionController from "../controllers/SessionController.js";

import authMiddleware from "../middlewares/auth.js";
import optionalAuthMiddleware from "../middlewares/optionalAuth.js";

import SchemaValidator from "../middlewares/SchemaValidator.js";

import { userCreateSchema, userUpdateSchema } from "../schemas/UserSchema.js";
import { postCreateSchema } from "../schemas/PostSchema.js";
import requireImage from "../middlewares/requireImage.js";

const routes = new Router();

routes.post("/login", SessionController.store);
routes.post("/users", SchemaValidator.validate(userCreateSchema), UserController.store);

routes.get("/posts", optionalAuthMiddleware, PostController.index);

routes.use(authMiddleware);

routes.put("/users", SchemaValidator.validate(userUpdateSchema), UserController.update);

routes.post("/posts", upload.single("image"), requireImage, SchemaValidator.validate(postCreateSchema), PostController.store);
routes.put("/posts/:post_id", PostController.update);
routes.delete("/posts/:post_id", PostController.destroy);

routes.post("/posts/:post_id/like", LikeController.toggle);

export default routes;