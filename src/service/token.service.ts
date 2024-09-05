import { jwtDecode } from "jwt-decode";
import sign from "jwt-encode";
interface JWTPayload {
    sub: number;
    name: string;
    iat: number;
    exp: number;
  };
export default class TokenService {
  constructor() {}
  tokenDecode(token: string): JWTPayload | null {
    try {
      const tokenDecoded: JWTPayload = jwtDecode(token);
      return tokenDecoded;
    } catch (error) {
      return null;
    }
  }
  generateJWT(payload: JWTPayload): string {
    const jwt = sign(payload, process.env.SECRETE);
    return jwt;
  }

  tokenVerify(token: string): boolean {
    const tokenDecoded = this.tokenDecode(token);
    if (!tokenDecoded) {
      return false;
    }
    const expireIn = tokenDecoded.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    return expireIn > currentTime;
  }
}
