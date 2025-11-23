import { Test, TestingModule } from '@nestjs/testing';
import { ProverbesController } from './proverbes.controller';
import { ProverbesService } from './proverbes.service';

describe('ProverbesController', () => {
  let controller: ProverbesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProverbesController],
      providers: [ProverbesService],
    }).compile();

    controller = module.get<ProverbesController>(ProverbesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
