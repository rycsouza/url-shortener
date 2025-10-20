import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { User } from '../user.entity';
import { UsersService } from '../users.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(() => Promise.resolve('hashed-password')),
}));

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('deve criar um novo usuário com senha criptografada', async () => {
    jest
      .spyOn(repo, 'create')
      .mockReturnValue({
        email: 'x@y.com',
        password: 'hashed-password',
      } as any);
    jest
      .spyOn(repo, 'save')
      .mockResolvedValue({ id: 'uuid', email: 'x@y.com' } as any);

    const result = await service.create('x@y.com', 'User', '123456');
    expect(result.email).toBe('x@y.com');
  });

  it('deve buscar usuário por e-mail', async () => {
    jest
      .spyOn(repo, 'findOne')
      .mockResolvedValue({ id: 'uuid', email: 'x@y.com' } as any);
    const result = await service.findByEmail('x@y.com');
    expect(result).toBeDefined();
    expect(result!.email).toBe('x@y.com');
  });
});
