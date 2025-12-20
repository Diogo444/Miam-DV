import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    create(createAdminDto: CreateAdminDto): Promise<{
        id: number;
        username: string;
        role: string;
    }>;
    findAll(): Promise<import("../users/entities/user.entity").User[]>;
    findOne(id: string): Promise<import("../users/entities/user.entity").User | null>;
    update(id: string, updateAdminDto: UpdateAdminDto): Promise<import("../users/entities/user.entity").User | null>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
