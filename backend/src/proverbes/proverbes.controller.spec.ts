import { Test, TestingModule } from '@nestjs/testing';
import { ProverbesController } from './proverbes.controller';
import { ProverbesService } from './proverbes.service';

describe('ProverbesController', () => {
  let controller: ProverbesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProverbesController],
      providers: [
        {
          provide: ProverbesService,
          useValue: {
            createOrReplace: vi.fn(),
            update: vi.fn(),
            findOne: vi.fn(),
            findSuggested: vi.fn(),
            remove: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProverbesController>(ProverbesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
