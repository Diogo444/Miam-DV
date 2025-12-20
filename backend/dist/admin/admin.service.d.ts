import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
export declare class AdminService {
    private adminRepository;
    constructor(adminRepository: Repository<User>);
    create(createAdminDto: CreateAdminDto): Promise<{
        id: number;
        username: string;
        role: string;
        tokenVersion: number;
    }>;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    update(id: number, updateAdminDto: UpdateAdminDto): Promise<User | null>;
    remove(id: number): Promise<{
        deleted: boolean;
    }>;
    private toSafeAdmin;
}
