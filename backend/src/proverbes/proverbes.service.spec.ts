import { Test, TestingModule } from '@nestjs/testing';
import { ProverbesService } from './proverbes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Proverbe } from './entities/proverbe.entity';
import { ProverbeSuggered } from './entities/proverbe_suggered.entity';

describe('ProverbesService', () => {
  let service: ProverbesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProverbesService,
        { provide: getRepositoryToken(Proverbe), useValue: {} },
        { provide: getRepositoryToken(ProverbeSuggered), useValue: {} },
      ],
    }).compile();

    service = module.get<ProverbesService>(ProverbesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
