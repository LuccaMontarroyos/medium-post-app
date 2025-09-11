import PostController from "../controllers/PostController";
import UserController from "../controllers/UserController";
import LikeController from "../controllers/LikeController";
import SessionController from "../controllers/SessionController";

import authMiddleware from "../middlewares/auth";

import SchemaValidator from "../middlewares/SchemaValidator";

import { userCreateSchema, userUpdateSchema } from "../schemas/UserSchema";
import { postCreateSchema } from "../schemas/PostSchema";

const routes = new Router();

routes.post("/login", SessionController.store);
routes.post("/users", SchemaValidator.validate(userCreateSchema), UserController.store);

routes.use(authMiddleware);

routes.put("/users/", SchemaValidator.validate(userUpdateSchema), UserController.update);

routes.get("/posts", PostController.index);
routes.post("/posts", SchemaValidator.validate(postCreateSchema), PostController.store);
routes.put("/posts/:post_id", PostController.update);
routes.delete("/posts/:post_id", PostController.destroy);

routes.post("/posts/:post_id/like", LikeController.toggle);