import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { AuthModule } from '../auth/auth.module';
import { Proverbe } from '../proverbes/entities/proverbe.entity';
import { ProverbeSuggered } from '../proverbes/entities/proverbe_suggered.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, Proverbe, ProverbeSuggered]), AuthModule],
  controllers: [MenusController],
  providers: [MenusService],
})
export class MenusModule {}
