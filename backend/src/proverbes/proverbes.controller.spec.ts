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
            createOrReplace: jest.fn(),
            update: jest.fn(),
            findOne: jest.fn(),
            findSuggested: jest.fn(),
            remove: jest.fn(),
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
