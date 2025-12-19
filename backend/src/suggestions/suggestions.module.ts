import { Module } from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import { SuggestionsController } from './suggestions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Suggestion } from './entities/suggestion.entity';
import { Proverbe } from 'src/proverbes/entities/proverbe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Suggestion, Proverbe])],
  controllers: [SuggestionsController],
  providers: [SuggestionsService],
})
export class SuggestionsModule {}
