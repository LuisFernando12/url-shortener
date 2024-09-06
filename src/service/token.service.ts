import { jwtDecode } from "jwt-decode";
import sign from "jwt-encode";
import  "dotenv/config";
import UserService from "./user.service";
import { logger } from "../util/logger";

interface JWTPayload {
    sub: number;
    name: string;
    iat: number;
    exp: number;
  };
export default class TokenService {
  constructor(
    private readonly userService: UserService
  ){
    logger.info("TokenService started");
  }
  tokenDecode(token: string): JWTPayload | null {
    logger.info("TokenDecode called");
    try {
      logger.info("Decoding token")
      const tokenDecoded: JWTPayload = jwtDecode(token);
      logger.info("Successfully decoded token")
      return tokenDecoded;
    } catch (error) {
      logger.error("Error: Failed to decode token");
      return null;
    }
  }
  generateJWT(payload: JWTPayload): string | null{
    logger.info("GenerateJWT called");    
    try {
      logger.info("Generating JWT")
      const jwt = sign(payload, process.env.SECRET);
      logger.info("Successfully generated JWT")
      return jwt;
    } catch (error) {
      logger.error("Error: Failed to generate JWT");
      return null;
    }
  }

  async tokenVerify(token: string): Promise<boolean> {
    logger.info("TokenVerify called");
    logger.info("TokenVerify: call tokenDecode")
    const tokenDecoded = this.tokenDecode(token);
    if (!tokenDecoded) {
      logger.error("Error: Invalid Token");
      return false;
    }
    logger.info("TokenVerify: call userService.getUserById to verify if user exists");
    const hasUser = await this.userService.getUserById(Number(tokenDecoded.sub));
    if (!hasUser) {
      logger.error("Error: User not found");     
      return false;
    }
    const expireIn = tokenDecoded.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    logger.info("TokenVerify: Compare current time and expireIn check if token is expired or not");
    return expireIn > currentTime;
  }
}
