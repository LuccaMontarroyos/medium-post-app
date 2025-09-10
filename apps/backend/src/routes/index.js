import PostController from "../controllers/PostController";
import auth from "../middlewares/auth";

const routes = new Router();

routes.post("/login", SessionController.store);
routes.post("/users", UserController.store);

routes.use(authMiddleware);

routes.update("/users", UserController.update);

routes.post("/posts", PostController.store);
routes.put("posts/:post_id", PostController.update);
routes.delete("posts/:post_id", PostController.destroy);
routes.get("posts", PostController.index);