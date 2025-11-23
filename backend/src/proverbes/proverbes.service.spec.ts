import { Test, TestingModule } from '@nestjs/testing';
import { ProverbesService } from './proverbes.service';

describe('ProverbesService', () => {
  let service: ProverbesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProverbesService],
    }).compile();

    service = module.get<ProverbesService>(ProverbesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
