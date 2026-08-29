import { Module } from '@nestjs/common';
import { ProverbesService } from './proverbes.service';
import { ProverbesController } from './proverbes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proverbe } from './entities/proverbe.entity';
import { ProverbeSuggered } from './entities/proverbe_suggered.entity';
import { RolesGuard } from '../common/guards/auth/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Proverbe, ProverbeSuggered])],
  controllers: [ProverbesController],
  providers: [ProverbesService, RolesGuard],
})
export class ProverbesModule {}
