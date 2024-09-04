import express, { json } from 'express';
import route from './src/routes.js';
import "reflect-metadata";
import { AppDataSource } from './src/config/data-source.js';

const app  = express();
AppDataSource.initialize().then(async () => {
    console.log('Connected to the database')
}).catch(error => console.log(error))
app.use(json());
app.use(route);
app.listen(3000, () => {console.log('Server runing')})