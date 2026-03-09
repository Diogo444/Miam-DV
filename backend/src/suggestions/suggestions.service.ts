import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Suggestion } from './entities/suggestion.entity';
import { Repository } from 'typeorm';
import { ProverbeSuggered } from '../proverbes/entities/proverbe_suggered.entity';

@Injectable()
export class SuggestionsService {
  constructor(
    @InjectRepository(Suggestion)
    private readonly suggestionRepository: Repository<Suggestion>,
    @InjectRepository(ProverbeSuggered)
    private readonly proverbeSuggeredRepository: Repository<ProverbeSuggered>,
  ) {}

  create(createSuggestionDto: CreateSuggestionDto) {
    return this.suggestionRepository.save(createSuggestionDto);
  }

  findAll() {
    return this.suggestionRepository.find();
  }

  async accept(id: number) {
    const suggestion = await this.suggestionRepository.findOneBy({ id });

    if (!suggestion) {
      throw new NotFoundException(`Suggestion ${id} introuvable`);
    }

    await this.proverbeSuggeredRepository.clear();
    await this.proverbeSuggeredRepository.save(
      this.proverbeSuggeredRepository.create({
        content: suggestion.content,
        type: normalizeSuggestionType(suggestion.type),
      }),
    );

    await this.suggestionRepository.delete(id);
    return suggestion;
  }

  remove(id: number) {
    return this.suggestionRepository.delete(id);
  }
}

function normalizeSuggestionType(type: Suggestion['type']): 'blague' | 'proverbe' {
  return type === 'Blague' ? 'blague' : 'proverbe';
}
