import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import path from "path";

import database from "./database/index.js";

class App {
    constructor() {
        this.server = express()
        this.middlewares();
        this.routes();
    }


    middlewares() {
        this.server.use(cors());
        this.server.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));
    }

    routes() {
        this.server.use(routes);
    }
}

export default new App().server;