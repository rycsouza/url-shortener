import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Url } from '../url.entity';
import { UrlsService } from '../urls.service';

describe('UrlsService', () => {
  let service: UrlsService;
  let repo: Repository<Url>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        {
          provide: getRepositoryToken(Url),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UrlsService>(UrlsService);
    repo = module.get<Repository<Url>>(getRepositoryToken(Url));
  });

  it('deve criar uma nova URL e gerar shortCode', async () => {
    jest
      .spyOn(repo, 'create')
      .mockReturnValue({ originalUrl: 'https://google.com' } as any);
    jest.spyOn(repo, 'save').mockImplementation(async (u) => ({
      ...u,
      id: 'uuid',
      shortCode: 'abc123',
      originalUrl: 'https://google.com',
      clicks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Url));

    const result = await service.create('https://google.com', 'user-uuid');
    expect(result.shortCode).toBeDefined();
  });

  it('deve lançar erro ao buscar shortCode inexistente', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValue(null);
    await expect(service.findByShortCode('invalid')).rejects.toThrow(
      NotFoundException,
    );
  });
});
