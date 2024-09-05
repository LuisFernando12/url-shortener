import { jwtDecode } from "jwt-decode";
import sign from "jwt-encode";
import  "dotenv/config";
import UserService from "./user.service";
import UserRepository from "../repository/user.repository";
import { AppDataSource } from "../config/data-source";
interface JWTPayload {
    sub: number;
    name: string;
    iat: number;
    exp: number;
  };
export default class TokenService {
  private readonly userService: UserService
  constructor(
  ) {
    this.userService = new UserService(new UserRepository(AppDataSource.getRepository('User')));
  }
  tokenDecode(token: string): JWTPayload | null {
    try {
      const tokenDecoded: JWTPayload = jwtDecode(token);
      return tokenDecoded;
    } catch (error) {
      return null;
    }
  }
  generateJWT(payload: JWTPayload): string | null{    
    try {
      const jwt = sign(payload, process.env.SECRET);
      return jwt;
    } catch (error) {
      return null;
    }
  }

  async tokenVerify(token: string): Promise<boolean> {
    const tokenDecoded = this.tokenDecode(token);
    if (!tokenDecoded) {
      return false;
    }
    const hasUser = await this.userService.getUserById(Number(tokenDecoded.sub));
    if (!hasUser) {     
      return false;
    }
    const expireIn = tokenDecoded.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    return expireIn > currentTime;
  }
}
