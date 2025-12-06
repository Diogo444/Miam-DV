import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { AuthModule } from '../auth/auth.module';
import { Proverbe } from 'src/proverbes/entities/proverbe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, Proverbe]), AuthModule],
  controllers: [MenusController],
  providers: [MenusService],
})
export class MenusModule {}
