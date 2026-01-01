import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { UpdateSuggestionDto } from './dto/update-suggestion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Suggestion } from './entities/suggestion.entity';
import { Repository } from 'typeorm';
import { Proverbe } from 'src/proverbes/entities/proverbe.entity';

@Injectable()
export class SuggestionsService {
  constructor(
    @InjectRepository(Suggestion)
    private readonly suggestionRepository: Repository<Suggestion>,
    @InjectRepository(Proverbe)
    private readonly proverbeRepository: Repository<Proverbe>,
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

  const normalizedType =
    suggestion.type === 'Blague' ? 'blague' : 'proverbe';

  await this.proverbeRepository.clear();
  const newProverbe = this.proverbeRepository.create({
    id: 1,
    content: suggestion.content,
    type: normalizedType,
  });
  await this.proverbeRepository.save(newProverbe);
  await this.suggestionRepository.delete(id);

  return suggestion;
}


  remove(id: number) {
    return this.suggestionRepository.delete(id);
  }
}
