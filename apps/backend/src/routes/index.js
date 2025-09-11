import PostController from "../controllers/PostController";
import UserController from "../controllers/UserController";
import LikeController from "../controllers/LikeController";
import SessionController from "../controllers/SessionController";

import authMiddleware from "../middlewares/auth";

import schemaValidator from "../middlewares/schemaValidator";
import { userCreateSchema, userUpdateSchema } from "../schemas/UserSchema";
import { postCreateSchema } from "../schemas/PostSchema";

const routes = new Router();

routes.post("/login", SessionController.store);
routes.post("/users", schemaValidator(userCreateSchema), UserController.store);

routes.use(authMiddleware);

routes.put("/users/", schemaValidator(userUpdateSchema), UserController.update);

routes.post("/posts", schemaValidator(postCreateSchema), PostController.store);
routes.put("/posts/:post_id", PostController.update);
routes.delete("/posts/:post_id", PostController.destroy);
routes.get("/posts", PostController.index);

routes.post("/posts/:post_id/like", LikeController.toggle);