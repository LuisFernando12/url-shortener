import { Request, Response } from "express";
import UserService from "../service/user.service";
import { User } from "../entity/User";
import TokenService from "../service/token.service";

export default class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService:TokenService
  ) {}

  async createUser(req: Request, res: Response): Promise<void> {
    if (!req.body) {
      res.status(400).json({ error: "No user data provided" });
    }
    try {
      const body = req.body as User;
      const user = await this.userService.createUser(body);
      res.status(201).json(user);
    } catch (error) {
      if(Number(error.code) === 23505 ){
        res.status(409).json({ error: 'Conflict' });
        return;
      }
      res.status(500).json({ error: error.message });
    }
  }

  async findUserById(req: Request, res: Response): Promise<void> {
    if (!req.headers.authorization) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    try {
      const token = req.headers.authorization.split(" ")[1];
      const tokenDecoded = this.tokenService.tokenDecode(token);
      if (!this.tokenService.tokenVerify(token) || !tokenDecoded) {
        res.status(401).json({ error: "Invalid Token" });
        return;
      }  

      const id = Number(req.params.id);
      const user = await this.userService.getUserById(id);
      res.json(user);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    if (!req.headers.authorization) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if (!req.body) {
      res.status(400).json({ error: "No user data provided" });
    }
    try {
      const token = req.headers.authorization.split(" ")[1];
      const tokenDecoded = this.tokenService.tokenDecode(token);
      if (!this.tokenService.tokenVerify(token) || !tokenDecoded) {
        res.status(401).json({ error: "Invalid Token" });
        return;
      }  
      
      const id = Number(req.params.id);
      const user = req.body as Partial<User>;
      const result = await this.userService.update(id, user);
      res.status(200).json({ message: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    if (!req.headers.authorization) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    try {
      const id = Number(req.params.id);
      await this.userService.delete(id);
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
