import UserService from "./user.service";
import * as bcrypt from "bcrypt";
import TokenService from "./token.service";
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
  ) {}

  private generateExpireIn(): number {
    const expireIn = Math.floor(Date.now()/ 1000 + (20 * 60));
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
    const expireIn = this.generateExpireIn();
    const payload: JWTPayload = {
      sub: user.id,
      name: user.name,
      iat: Math.floor(Date.now() / 1000),
      exp: expireIn,
    };
    
    const jwt = this.tokenService.generateJWT(payload);
    if(!jwt){
      throw new Error("Unhatorized");
    }
    return {
      access_token: jwt,
      expireIn
    };
  }
}
