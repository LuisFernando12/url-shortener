import express, { json } from "express";
import route from "./src/routes.js";
import "reflect-metadata";
import { AppDataSource } from "./src/config/data-source.js";
import { setupSwagger } from "./src/config/swagger.js";
import { logger } from "./src/util/logger.js";

const app  = express();
AppDataSource.initialize().then(async () => {
    logger.info("Connected to the database")
}).catch(error => console.log(error))
app.use(json());
app.use(route);

setupSwagger(app)
app.listen(process.env.PORT, () => {logger.info("Server runing")})