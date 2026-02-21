import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import path from "path";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json" with { type: "json" };

import database from "./database/index.js";

class App {
	constructor() {
		this.server = express();
		this.middlewares();
		this.routes();
		this.setupSwagger();
	}

	middlewares() {
		this.server.use(cors());
		this.server.use(
			"/uploads",
			express.static(path.resolve(process.cwd(), "uploads"))
		);
	}

	routes() {
		this.server.use(routes);
	}

	setupSwagger() {
		this.server.use(
			"/api-docs",
			swaggerUi.serve,
			swaggerUi.setup(swaggerDocument)
		);
	}
}

export default new App().server;
