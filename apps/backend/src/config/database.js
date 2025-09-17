import dotenv from "dotenv";

dotenv.config();
// const dotenv = require('dotenv').config();

export default {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    },
    timezone: "+00:00"
}