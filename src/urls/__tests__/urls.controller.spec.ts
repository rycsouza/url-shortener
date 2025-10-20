import { Test, TestingModule } from '@nestjs/testing';

import { UrlsController } from '../urls.controller';
import { UrlsService } from '../urls.service';

describe('UrlsController', () => {
  let controller: UrlsController;
  let urlsService: Partial<UrlsService>;

  beforeAll(() => {
    process.env.BASE_URL = 'http://localhost:3000';
  });

  beforeEach(async () => {
    urlsService = {
      create: jest.fn().mockResolvedValue({
        id: 'uuid',
        originalUrl: 'https://google.com',
        shortCode: 'abc123',
        clicks: 0,
        shortUrl: 'http://localhost:3000/my/abc123',
      }),
      findUserUrls: jest.fn().mockResolvedValue([]),
      updateUrl: jest.fn(),
      softDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlsController],
      providers: [{ provide: UrlsService, useValue: urlsService }],
    }).compile();

    controller = module.get<UrlsController>(UrlsController);
  });

  it('deve criar uma nova URL encurtada', async () => {
    const result = await controller.create(
      { originalUrl: 'https://google.com' },
      { user: null },
    );
    expect(result).toBeDefined();
    expect(result.shortUrl).toBeDefined();
    expect(result.shortUrl).toContain('http');
  });

  it('deve listar URLs do usuário autenticado', async () => {
    const result = await controller.findUserUrls({ user: { userId: 'uuid' } });
    expect(result).toBeInstanceOf(Array);
  });
});
