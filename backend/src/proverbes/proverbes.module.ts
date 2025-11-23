import { Module } from '@nestjs/common';
import { ProverbesService } from './proverbes.service';
import { ProverbesController } from './proverbes.controller';

@Module({
  controllers: [ProverbesController],
  providers: [ProverbesService],
})
export class ProverbesModule {}
