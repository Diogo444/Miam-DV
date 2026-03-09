import { Module } from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import { SuggestionsController } from './suggestions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Suggestion } from './entities/suggestion.entity';
import { ProverbeSuggered } from '../proverbes/entities/proverbe_suggered.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Suggestion, ProverbeSuggered])],
  controllers: [SuggestionsController],
  providers: [SuggestionsService],
})
export class SuggestionsModule {}
