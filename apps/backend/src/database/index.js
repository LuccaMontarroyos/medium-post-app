import { Sequelize, Model } from "sequelize";
import dbConfig from "../config/database.js";

import User from "../models/User.js";
import Post from "../models/Post.js";
import PostLike from "../models/PostLike.js";

const connection = new Sequelize(dbConfig)

User.init(connection);
Post.init(connection);
PostLike.init(connection);

Post.associate(connection.models);
User.associate(connection.models);
PostLike.associate(connection.models);

export default connection;