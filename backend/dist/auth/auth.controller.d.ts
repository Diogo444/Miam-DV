import { AuthService } from './auth.service';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { LoginDto } from './dto/login.dto';
import type { Request as ExpressRequest } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(payload: CreateAdminDto): Promise<{
        access_token: string;
        user: {
            id: number;
            username: string;
            role: string;
            tokenVersion: number;
        };
    }>;
    login(_payload: LoginDto, req: ExpressRequest): Promise<{
        access_token: string;
        user: {
            id: number;
            username: string;
            role: string;
            tokenVersion: number;
        };
    }>;
    me(req: ExpressRequest): Promise<{
        user: {
            id: number;
            username: string;
            role: string;
            tokenVersion: number;
        };
    }>;
}
