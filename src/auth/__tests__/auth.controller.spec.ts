import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: Partial<AuthService>;

  beforeEach(async () => {
    authService = {
      register: jest.fn().mockResolvedValue({ id: 'uuid', email: 'test@example.com' }),
      login: jest.fn().mockResolvedValue({ access_token: 'fake-jwt-token' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('deve registrar um novo usuário', async () => {
    const result = await controller.register({
      email: 'test@example.com',
      name: 'User',
      password: '123456',
    });
    expect(result).toEqual({ id: 'uuid', email: 'test@example.com' });
  });

  it('deve realizar login e retornar token', async () => {
    const result = await controller.login({
      email: 'test@example.com',
      password: '123456',
    });
    expect(result).toEqual({ access_token: 'fake-jwt-token' });
  });
});
