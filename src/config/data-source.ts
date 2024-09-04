import "reflect-metadata"
import { DataSource } from "typeorm"
import 'dotenv/config'
import { User } from "../entity/User"
import { Url } from "../entity/Urls"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.HOST,
    port: 5433,
    username: process.env.USER_DB,
    password: process.env.PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [User, Url],
    migrations: [],
    subscribers: [],
})
