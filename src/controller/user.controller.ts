import { Request, Response } from "express";
import UserService from "../service/user.service";
import { User } from "../entity/User";
import TokenService from "../service/token.service";
import { logger } from "../util/logger";

export default class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService:TokenService
  ) {
    logger.info("UserController started");
  }

  async createUser(req: Request, res: Response): Promise<void> {
    logger.info("UserController: CreateUser called");
    if (!req.body.name || !req.body.email || !req.body.password) {
      logger.error("Error: No user data provided");
      res.status(400).json({ error: "No user data provided" });
    }
    try {
      const body = req.body as User;
      logger.info("CreateUser: call userService.create")
      const user = await this.userService.createUser(body);
      res.status(201).json(user);
    } catch (error) {
      if(Number(error.code) === 23505 ){
        logger.error("Error: Conflict Error")
        res.status(409).json({ error: 'Conflict' });
        return;
      }
      logger.error(`Error at createUser: ${JSON.stringify(error)}`)
      res.status(500).json({ error: error.message });
    }
  }

  async findUserById(req: Request, res: Response): Promise<void> {
    logger.info("UserController: FindUserById called");
    if (!req.headers.authorization) {
      logger.error("Error: Authorization Error");
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    try {
      const token = req.headers.authorization.split(" ")[1];
      const tokenDecoded = this.tokenService.tokenDecode(token);
      const tokenIsValid = await this.tokenService.tokenVerify(token);
      
      if (!tokenIsValid || !tokenDecoded) {
        logger.error("Error: Invalid Token")
        res.status(401).json({ error: "Invalid Token" });
        return;
      }  
      const id = Number(req.params.id);
      logger.info("FindUserById: call userService.getUserById");
      const user = await this.userService.getUserById(id);
      if(!user){
        logger.error("Error: User not found")
        res.status(404).json({ error: 'User not found' });
        return;
      }
      logger.info("User found");
      res.json(user);
    } catch (error) {
      logger.error(`Error at findUserById: ${JSON.stringify(error)}`);
      res.status(500).json({ error: error.message });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    logger.info("UserController: UpdateUser called");
    if (!req.headers.authorization) {
      logger.error("Error: Authorization Error");
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if (!req.body.name && !req.body.email) {
      logger.error("Error: No user data provided");
      res.status(400).json({ error: "No user data provided" });
      return;
    }
    if(req.body.password){
      logger.error("Error: Password should not be updated");
      res.status(400).json({ error: "Password should not be updated" });
      return;
    }
    try {
      const token = req.headers.authorization.split(" ")[1];
      const tokenDecoded = this.tokenService.tokenDecode(token);
      const tokenIsValid = await this.tokenService.tokenVerify(token);
      
      if (!tokenIsValid || !tokenDecoded) {
        logger.error("Error: Invalid Token")
        res.status(401).json({ error: "Invalid Token" });
        return;
      } 
      
      const id = Number(req.params.id);
      const user = req.body as Partial<User>;
      logger.info("UpdateUser: call userService.update");
      const result = await this.userService.update(id, user);
      logger.info("User updated successfully");
      res.status(200).json({ message: result });
    } catch (error) {
      logger.error(`Error at updateUser: ${JSON.stringify(error)}`);
      res.status(500).json({ error: error.message });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    logger.info("UserController: DeleteUser called");
    if (!req.headers.authorization) {
      logger.error("Error: Authorization Error");
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    try {
      const token = req.headers.authorization.split(" ")[1];
      const tokenDecoded = this.tokenService.tokenDecode(token);
      const tokenIsValid = await this.tokenService.tokenVerify(token);
      
      if (!tokenIsValid || !tokenDecoded) {
        logger.error("Error: Invalid Token")
        res.status(401).json({ error: "Invalid Token" });
        return;
      } 
      const id = Number(req.params.id);
      logger.info("DeleteUser: call userService.delete");
      await this.userService.delete(id);
      logger.info("User deleted successfully");
      res.status(204).json();
    } catch (error) {
      logger.error(`Error at deleteUser: ${JSON.stringify(error)}`);
      res.status(500).json({ error: error.message });
    }
  }
}
