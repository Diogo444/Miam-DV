import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { AdminSeedService } from './admin.seed.service';
import { RolesGuard } from '../common/guards/auth/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AdminController],
  providers: [AdminService, AdminSeedService, RolesGuard],
  exports: [AdminService],
})
export class AdminModule {}
