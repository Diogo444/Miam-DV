import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { AdminService } from './admin.service';

@Injectable()
export class AdminSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminSeedService.name);

  constructor(
    private readonly adminService: AdminService,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    const existingUsers = await this.users.count();
    if (existingUsers > 0) {
      this.logger.debug('Default admin seed skipped (users already exist).');
      return;
    }

    const username = process.env.DEFAULT_ADMIN_USERNAME ?? 'admin';
    const password = process.env.DEFAULT_ADMIN_PASSWORD ?? 'admin';

    await this.adminService.create({ username, password, role: 'admin' });
    this.logger.warn(`Default admin created: ${username}`);
  }
}
