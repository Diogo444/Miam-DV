import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { McpController } from './mcp.controller';
import { McpService } from './mcp.service';
import { WeekMenu } from './entities/week-menu.entity';
import { WeekProverb } from './entities/week-proverb.entity';
import { McpGuard } from './guards/mcp.guard';
import { McpRateLimitGuard } from './guards/mcp-rate-limit.guard';
import { Menu } from '../menus/entities/menu.entity';
import { Proverbe } from '../proverbes/entities/proverbe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WeekMenu, WeekProverb, Menu, Proverbe])],
  controllers: [McpController],
  providers: [McpService, McpGuard, McpRateLimitGuard],
})
export class McpModule {}
