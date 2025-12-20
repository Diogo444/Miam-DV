import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminService } from '../admin/admin.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;

  const adminServiceMock = {
    findByUsername: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  };

  const jwtServiceMock = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: AdminService, useValue: adminServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
