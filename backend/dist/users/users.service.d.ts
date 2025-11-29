import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(username: string, password: string, role?: string): Promise<User>;
    findByUsername(username: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
}
