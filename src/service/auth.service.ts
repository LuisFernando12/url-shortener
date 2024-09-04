import UserService from "./user.service";
import * as bcrypt from "bcrypt";
import sign from "jwt-encode";
type JWTPayload = {
  sub: number;
  name: string;
  iat: number;
};
export default class AuthService {
  constructor(private readonly userService: UserService) {}

  private generateJWT(payload: JWTPayload): string {
    const jwt = sign(payload, process.env.SECRETE);
    return jwt;
  }
  private generateExpireIn(): number {
    const expireIn = Math.floor(Date.now()/ 1000 + 60);
    return expireIn;
  }
  async login(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
    const payload: JWTPayload = {
      sub: user.id,
      name: user.name,
      iat: Math.floor(Date.now() / 1000),
    };

    const jwt = this.generateJWT(payload);
    return {
      access_token: jwt,
    };
  }
}
