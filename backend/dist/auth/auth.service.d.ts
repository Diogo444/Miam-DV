import { AdminService } from '../admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { User } from '../users/entities/user.entity';
export type AuthUser = Omit<User, 'password'> & {
    password?: string;
};
export declare class AuthService {
    private admins;
    private jwt;
    private readonly logger;
    constructor(admins: AdminService, jwt: JwtService);
    validateUser(username: string, password: string): Promise<{
        username: string;
        id: number;
        role: string;
    } | null>;
    register(payload: CreateAdminDto): Promise<{
        access_token: string;
        user: {
            username: string;
            id: number;
            role: string;
        };
    }>;
    login(user: AuthUser): Promise<{
        access_token: string;
        user: {
            username: string;
            id: number;
            role: string;
        };
    }>;
    me(user: {
        id: number;
    }): Promise<{
        user: {
            username: string;
            id: number;
            role: string;
        };
    }>;
    private buildAuthResponse;
    private toSafeUser;
}
