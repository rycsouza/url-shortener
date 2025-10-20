import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('fake-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('deve registrar um novo usuário', async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
    (usersService.create as jest.Mock).mockResolvedValue({
      id: 'uuid',
      email: 'test@example.com',
    });

    const result = await service.register('test@example.com', 'User', '123456');
    expect(result).toEqual({ id: 'uuid', email: 'test@example.com' });
  });

  it('deve lançar erro se o e-mail já existir', async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValue({
      email: 'existing@example.com',
    });

    await expect(
      service.register('existing@example.com', 'User', '123456'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('deve realizar login e retornar token JWT', async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValue({
      id: 'uuid',
      email: 'test@example.com',
      password: await bcrypt.hash('123456', 10),
    });

    const result = await service.login('test@example.com', '123456');
    expect(result).toEqual({ access_token: 'fake-jwt-token' });
  });

  it('deve lançar erro se as credenciais forem inválidas', async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
    await expect(service.login('x@y.com', 'wrong')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
