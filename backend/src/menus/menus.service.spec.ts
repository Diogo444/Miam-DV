import { Test, TestingModule } from '@nestjs/testing';
import { MenusService } from './menus.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { Proverbe } from '../proverbes/entities/proverbe.entity';
import { ProverbeSuggered } from '../proverbes/entities/proverbe_suggered.entity';

describe('MenusService', () => {
  let service: MenusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenusService,
        { provide: getRepositoryToken(Menu), useValue: {} },
        { provide: getRepositoryToken(Proverbe), useValue: {} },
        { provide: getRepositoryToken(ProverbeSuggered), useValue: {} },
      ],
    }).compile();

    service = module.get<MenusService>(MenusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
