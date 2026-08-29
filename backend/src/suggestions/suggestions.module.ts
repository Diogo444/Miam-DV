import { Module } from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import { SuggestionsController } from './suggestions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Suggestion } from './entities/suggestion.entity';
import { ProverbeSuggered } from '../proverbes/entities/proverbe_suggered.entity';
import { RolesGuard } from '../common/guards/auth/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Suggestion, ProverbeSuggered])],
  controllers: [SuggestionsController],
  providers: [SuggestionsService, RolesGuard],
})
export class SuggestionsModule {}
