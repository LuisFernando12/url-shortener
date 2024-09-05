import { IsNull, Repository } from "typeorm";
import { User } from "../entity/User";
import { UserDTO } from "../dto/user.dto";

export default class UserRepository {
  constructor(private readonly repository: Repository<User>) {}

  async create(user: UserDTO): Promise<User> {
    return await this.repository.save(user);
  }
  async findById(id: number): Promise<User> {
    return await this.repository.findOne({
      where: { id },
      select: ["createdAt", "email", "name", "id", "urls"],
    });
  }
  async findByEmail(email: string): Promise<User> {
    return await this.repository.findOne({ where: { email } });
  }
  async update(id: number, user: Partial<User>): Promise<any> {
    return await this.repository.update({id, deletedAt: IsNull()}, user);
  }
  async delete(id: number): Promise<any> {
    return await this.repository.update(id, { deletedAt: new Date() });
  }
}
