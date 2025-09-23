// backend/src/routes/postRoutes.js

import { Router, json as jsonParser } from "express";
import { upload } from "../config/multer.js";

import PostController from "../controllers/PostController.js";
import LikeController from "../controllers/LikeController.js";

import authMiddleware from "../middlewares/auth.js";
import optionalAuthMiddleware from "../middlewares/optionalAuth.js";
import SchemaValidator from "../middlewares/SchemaValidator.js";
import { postCreateSchema } from "../schemas/PostSchema.js";
import requireImage from "../middlewares/requireImage.js";

const postRoutes = new Router();

postRoutes.get("/", optionalAuthMiddleware, PostController.index);

postRoutes.use(authMiddleware);

postRoutes.post("/", upload.single("image"), requireImage, SchemaValidator.validate(postCreateSchema), 
PostController.store);

postRoutes.put("/:post_id", jsonParser(), PostController.update);

postRoutes.delete("/:post_id", PostController.destroy);

postRoutes.post("/:post_id/like", LikeController.toggle);

export default postRoutes;