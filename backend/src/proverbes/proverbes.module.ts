import { Module } from '@nestjs/common';
import { ProverbesService } from './proverbes.service';
import { ProverbesController } from './proverbes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proverbe } from './entities/proverbe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proverbe])],
  controllers: [ProverbesController],
  providers: [ProverbesService],
})
export class ProverbesModule {}
