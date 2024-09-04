import { Request, Response, Router } from "express";
import UrlShortenerController from "./controller/urlShortener.controller.js";
import UrlShortnerService from "./service/urlShortener.service.js";
import UrlRepository from "./repository/url.repository.js";
import { AppDataSource } from "./config/data-source.js";
import UserController from "./controller/user.controller.js";
import UserRepository from "./repository/user.repository.js";
import UserService from "./service/user.service.js";
import AuthService from "./service/auth.service.js";
import AuthController from "./controller/auth.controller.js";

const route = Router();
const urlService = new UrlRepository(AppDataSource.getRepository('Url'));
const urlShortenerService = new UrlShortnerService(urlService);
const urlShortenerController = new UrlShortenerController(urlShortenerService);


const userRepository = new UserRepository(AppDataSource.getRepository('User'));
const userService = new UserService(userRepository)
const userController = new UserController(userService);

const authService = new AuthService(userService);
const authController = new AuthController(authService)

route.post('/url-shortener',  (req: Request, res: Response) => urlShortenerController.createShortUrl(req, res));
route.get('/url-shortener/:id',  (req: Request, res: Response) => urlShortenerController.findById(req, res));
route.get('/url-shortener/user/:id',  (req: Request, res: Response) => urlShortenerController.findByUserId(req, res));
route.put('/url-shortener/:id',  (req: Request, res: Response) => urlShortenerController.update(req, res));
route.delete('/url-shortener/:id',  (req: Request, res: Response) => urlShortenerController.delete(req, res));

route.post('/user', (req: Request, res: Response) => userController.createUser(req, res));
route.get('/user/:id', (req: Request, res: Response) => userController.findUserById(req, res));
route.put('/user/:id', (req: Request, res: Response) => userController.updateUser(req, res));
route.delete('/user/:id', (req: Request, res: Response) => userController.deleteUser(req, res));

route.post('/auth/login', (req:Request, res:Response) => authController.login(req, res));

route.get('/:hash',  (req: Request, res: Response) => urlShortenerController.redirectToLongUrl(req, res));
export default route;