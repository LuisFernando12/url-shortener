import UserService from "./user.service";
import * as bcrypt from "bcrypt";
import TokenService from "./token.service";
import { logger } from "../util/logger";

type JWTPayload = {
  sub: number;
  name: string;
  iat: number;
  exp: number;
};
export default class AuthService {
  constructor(
    private readonly userService: UserService,
    private  readonly tokenService: TokenService
  ) {
    logger.info("AuthService started");
  }

  private generateExpireIn(): number {
    logger.info("generateExpireIn called");
    const expireIn = Math.floor(Date.now()/ 1000 + (20 * 60));
    logger.info("Return expireIn");
    return expireIn;
  }
  async login(email: string, password: string) {
    logger.info("AuthService: Login called");
    logger.info("Login: call userService.login");
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      logger.error("Error: User not found")
      throw new Error("Invalid email or password");
    }
    logger.info("Login: call bcrypt.compare to compare password");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      logger.error("Error: Invalid password");
      throw new Error("Invalid email or password");
    }
    const expireIn = this.generateExpireIn();
    const payload: JWTPayload = {
      sub: user.id,
      name: user.name,
      iat: Math.floor(Date.now() / 1000),
      exp: expireIn,
    };
    logger.info("Login: call tokenService.login");
    const jwt = this.tokenService.generateJWT(payload);
    if(!jwt){
      logger.error("Error: Failed to generate JWT");
      throw new Error("Unhatorized");
    }
    return {
      access_token: jwt,
      expireIn
    };
  }
}
