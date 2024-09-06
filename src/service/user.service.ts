import { UserDTO } from "../dto/user.dto";
import { User } from "../entity/User";
import UserRepository from "../repository/user.repository";
import * as bcrypt from 'bcrypt';
import { logger } from "../util/logger"
export default class UserService {
    constructor(private readonly userRepository: UserRepository){
        logger.info("UserService started")
    }
    private async encryptPassword(password: string){
        logger.info("EncryptPassword called")
        const salt: number = 10;
        try {
            logger.info("encrypting password")
            password = await bcrypt.hash(password, salt);
            logger.info("Return encrypt password")
            return password;
        } catch (error) {
            logger.error("Error to the encrypt password");
            throw new Error("Failed to encrypt password");
        }
    }
    async createUser(user: UserDTO) : Promise<User> {
        logger.info("CreateUser called");
        logger.info("Call encryptPassword");
        const password = await this.encryptPassword(user.password);
        if(!password){
            logger.error("Error: Failed to encrypt password");
            throw new Error("Failed to encrypt password");
        }
        user.password = password;
        logger.info("CreateUser: call userRepository.create");
        const result = await this.userRepository.create(user);
        if(!! result){
            delete result.password;
            logger.info("Successfully created user");
            return result;
        }
        logger.error("Error: Failed to create user");
        throw new Error('Failed to create user');
    }
    async getUserById(id: number): Promise<User | null> {
        logger.info("GetUserById called");
        logger.info("GetUserById: call  userRepository.findById")
        const user  = await this.userRepository.findById(id);
        if(!! user){
            logger.info("User found")
            return user;
        }
        logger.error("Error: User not found")
        return null;
    }
    async getUserByEmail(email: string): Promise<User> {
        logger.info("GetUserByEmail called");
        logger.info("CetUserByEmail: userRepository.findByemail");
        const user  = await this.userRepository.findByEmail(email);
        if(!! user){
            logger.info("User found")
            return user;
        }
        logger.error("Error: User not found")
        throw new Error('Invalid email or password');
    }
    async update(id: number, body: Partial<User>) : Promise<string> {
        logger.info("Update called");
        logger.info("Updatte: call userRepository.update");
        const user = await this.userRepository.update(id, body);
        if(user.affected === 0){
            logger.error("Error: Failed to update user")
            throw new Error('Failed to update user');
        }
        logger.info("User updated")
        return "User updated successfully";
    }
    async delete(id: number): Promise<void> {
        logger.info("Delete called");
        logger.info("Delete: call userRepository.delete")
        const userDeleted = await this.userRepository.delete(id);
        if(userDeleted.affected === 0){
            logger.error("Error: Failed to delete user");
            throw new Error('Failed to delete user');
        }
        return;
    }
}