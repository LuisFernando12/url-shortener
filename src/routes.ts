import { Request, Response, Router } from "express";
import UrlShortenerController from "./controller/urlShortener.controller.js";
import UrlShortnerService from "./service/urlShortener.service.js";
import UrlRepository from "./repository/url.repository.js";
import { AppDataSource } from "./config/data-source.js";

const route = Router();
const urlService = new UrlRepository(AppDataSource.getRepository('Url'));
const urlShortenerService = new UrlShortnerService(urlService);
const urlShortenerController = new UrlShortenerController(urlShortenerService);

route.post('/url-shortener',  (req: Request, res: Response) => urlShortenerController.createShortUrl(req, res));
route.get('/url-shortener/:id',  (req: Request, res: Response) => urlShortenerController.findById(req, res));
route.get('/url-shortener/user/:id',  (req: Request, res: Response) => urlShortenerController.findByUserId(req, res));
route.put('/url-shortener/:id',  (req: Request, res: Response) => urlShortenerController.update(req, res));
route.delete('/url-shortener/:id',  (req: Request, res: Response) => urlShortenerController.delete(req, res));


route.get('/:hash',  (req: Request, res: Response) => urlShortenerController.redirectToLongUrl(req, res));
export default route;