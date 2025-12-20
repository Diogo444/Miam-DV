import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private adminRepository: Repository<User>,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    const hash = await bcrypt.hash(createAdminDto.password, 10);
    const role = createAdminDto.role ?? 'admin';
    const admin = this.adminRepository.create({
      username: createAdminDto.username,
      password: hash,
      role,
    });
    const saved = await this.adminRepository.save(admin);
    return this.toSafeAdmin(saved);
  }

  async findAll() {
    return this.adminRepository.find({
      select: ['id', 'username', 'role'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    return this.adminRepository.findOne({
      where: { id },
      select: ['id', 'username', 'role'],
    });
  }

  async findByUsername(username: string) {
    return this.adminRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password', 'role', 'tokenVersion'],
    });
  }

  async findById(id: number) {
    return this.adminRepository.findOne({
      where: { id },
      select: ['id', 'username', 'role', 'tokenVersion'],
    });
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const updatePayload: Partial<User> = {};

    if (updateAdminDto.username !== undefined) {
      updatePayload.username = updateAdminDto.username;
    }

    if (updateAdminDto.role !== undefined) {
      updatePayload.role = updateAdminDto.role;
    }

    if (updateAdminDto.password) {
      updatePayload.password = await bcrypt.hash(updateAdminDto.password, 10);
    }

    if (!Object.keys(updatePayload).length) {
      return this.findOne(id);
    }

    await this.adminRepository.update({ id }, updatePayload);
    await this.adminRepository.increment({ id }, 'tokenVersion', 1);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.adminRepository.delete({ id });
    return { deleted: true };
  }

  private toSafeAdmin(admin: User) {
    const { password, ...safeAdmin } = admin;
    return safeAdmin;
  }
}
