import { UserDTO } from "../dto/user.dto";
import { User } from "../entity/User";
import UserRepository from "../repository/user.repository";
import * as bcrypt from 'bcrypt';
export default class UserService {
    constructor(private readonly userRepository: UserRepository){}
    private async encryptPassword(password: string){
        const salt: number = 10;
        try {
            password = await bcrypt.hash(password, salt);
            return password;
        } catch (error) {
            throw new Error("Failed to encrypt password");
        }
    }
    async createUser(user: UserDTO) : Promise<User> {
        const password = await this.encryptPassword(user.password);
        if(!password){
            throw new Error("Failed to encrypt password");
        }
        user.password = password;
        const result = await this.userRepository.create(user);
        if(!! result){
            delete result.password;
            return result;
        }
        throw new Error('Failed to create user');
    }
    async getUserById(id: number): Promise<User> {
        const user  = await this.userRepository.findById(id);
        if(!! user){
            return user;
        }
        throw new Error('User not found');
    }
    async getUserByEmail(email: string): Promise<User> {
        const user  = await this.userRepository.findByEmail(email);
        if(!! user){
            return user;
        }
        throw new Error('Invalid email or password');
    }
    async update(id: number, body: Partial<User>) : Promise<string> {
        const user = await this.userRepository.update(id, body);
        if(user.affected === 0){
            throw new Error('Failed to update user');
        }
        return "User updated successfully";
    }
    async delete(id: number): Promise<void> {
        const userDeleted = await this.userRepository.delete(id);
        if(userDeleted.affected === 0){
            throw new Error('Failed to delete user');
        }
        return;
    }
}