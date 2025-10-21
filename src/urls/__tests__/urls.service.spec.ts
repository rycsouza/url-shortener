import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from '../urls.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Url } from '../url.entity';
import { DeepPartial } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('UrlsService', () => {
  let service: UrlsService;
  let repo: {
    create: jest.Mock;
    save: jest.Mock;
    findOne: jest.Mock;
  };
  let cache: {
    get: jest.Mock;
    set: jest.Mock;
    del: jest.Mock;
  };

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    cache = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        { provide: getRepositoryToken(Url), useValue: repo },
        { provide: CACHE_MANAGER, useValue: cache },
      ],
    }).compile();

    service = module.get(UrlsService);
  });

  it('deve criar uma nova URL e gerar shortCode', async () => {
    repo.create.mockReturnValue({ originalUrl: 'https://google.com' } as DeepPartial<Url>);

    repo.save.mockResolvedValueOnce({
      id: 'uuid',
      originalUrl: 'https://google.com',
      clicks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Url);

    const result = await service.create('https://google.com', 'user-uuid');

    expect(result.shortCode).toBeDefined();
  });

  it('deve lançar erro ao buscar shortCode inexistente', async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(service.findByShortCode('invalid')).rejects.toThrow();
  });
});
