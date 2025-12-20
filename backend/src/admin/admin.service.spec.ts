import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

describe('AdminService', () => {
  let service: AdminService;
  const adminRepositoryMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: getRepositoryToken(User), useValue: adminRepositoryMock },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
