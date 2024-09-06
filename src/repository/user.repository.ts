import { IsNull, Repository } from "typeorm";
import { User } from "../entity/User";
import { UserDTO } from "../dto/user.dto";
import { logger } from "../util/logger"
export default class UserRepository {
  constructor(private readonly repository: Repository<User>) {
    logger.info("UserRepository started")
  }

  async create(user: UserDTO): Promise<User> {
    logger.info("Create called");
    return await this.repository.save(user);
  }
  async findById(id: number): Promise<User> {
    logger.info("FindById called");
    return await this.repository.findOne({
      where: { id },
      select: ["createdAt", "email", "name", "id", "urls"],
    });
  }
  async findByEmail(email: string): Promise<User> {
    logger.info("FindByEmail called");
    return await this.repository.findOne({ where: { email } });
  }
  async update(id: number, user: Partial<User>): Promise<any> {
    logger.info("Update called")
    return await this.repository.update({id, deletedAt: IsNull()}, user);
  }
  async delete(id: number): Promise<any> {
    logger.info("Delete called")
    return await this.repository.update(id, { deletedAt: new Date() });
  }
}
