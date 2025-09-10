import { Sequelize, Model } from "sequelize";
import dbConfig from "../config/database";

import User from "../models/User";
import Post from "../models/Post";

const connection = new Sequelize(dbConfig)

User.init(connection);
Post.init(connection);

Post.associate(connection.models);
User.associate(connection.models);

export default connection;