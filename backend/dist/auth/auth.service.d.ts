import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthService {
    private users;
    private jwt;
    private readonly logger;
    constructor(users: UsersService, jwt: JwtService);
    validateUser(username: string, password: string): Promise<{
        id: number;
        username: string;
        role: string;
    } | null>;
    register(payload: CreateUserDto): Promise<{
        access_token: string;
        user: {
            id: number;
            username: string;
            role: string;
        };
    }>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: number;
            username: string;
            role: string;
        };
    }>;
    me(user: {
        id: number;
    }): Promise<{
        user: {
            id: number;
            username: string;
            role: string;
        };
    }>;
    private buildAuthResponse;
    private toSafeUser;
}
