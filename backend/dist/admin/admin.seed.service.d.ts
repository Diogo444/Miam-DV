import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { AdminService } from './admin.service';
export declare class AdminSeedService implements OnApplicationBootstrap {
    private readonly adminService;
    private readonly users;
    private readonly logger;
    constructor(adminService: AdminService, users: Repository<User>);
    onApplicationBootstrap(): Promise<void>;
}
