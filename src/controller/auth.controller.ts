import { Request, Response } from "express";
import AuthService from "../service/auth.service";
import { logger } from "../util/logger";

export default class AuthController{
    constructor(private readonly authService: AuthService){}
    
    async login(req: Request, res: Response): Promise<void> {
        logger.info("AuthController: started");
        logger.info("Started method login ");
        if(!req.body.email || !req.body.password){
            logger.error(`Error: no data provide`);
            res.status(400).json({ error: 'No data provided' });
            return;
        }
        try {
            const { email, password } = req.body;
            logger.info("AuthController: Call authService.login");
            const token = await this.authService.login(email, password);
            logger.info("Returned token");
            res.json(token);
        } catch (error) {
            logger.error(`Error: ${error.message}`);
            res.status(401).json({ error: error.message });
        }
    }
} 