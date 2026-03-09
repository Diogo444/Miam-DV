import { Test, TestingModule } from '@nestjs/testing';
import { SuggestionsService } from './suggestions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Suggestion } from './entities/suggestion.entity';
import { ProverbeSuggered } from '../proverbes/entities/proverbe_suggered.entity';

describe('SuggestionsService', () => {
  let service: SuggestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuggestionsService,
        { provide: getRepositoryToken(Suggestion), useValue: {} },
        { provide: getRepositoryToken(ProverbeSuggered), useValue: {} },
      ],
    }).compile();

    service = module.get<SuggestionsService>(SuggestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
