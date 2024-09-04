import { Request, Response } from "express";
import AuthService from "../service/auth.service";

export default class AuthController{
    constructor(private readonly authService: AuthService){}

    async login(req: Request, res: Response): Promise<void> {
        if(!req.body){
            res.status(400).json({ error: 'No data provided' });
            return;
        }
        try {
            const { email, password } = req.body;
            const token = await this.authService.login(email, password);
            res.json(token);
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
} 