import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { IsNull, Repository } from 'typeorm';

import { Url } from './url.entity';

import type { Cache } from 'cache-manager';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private readonly urlsRepo: Repository<Url>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private generateShortCode(id: string): string {
    return createHash('sha256').update(id).digest('base64url').substring(0, 6);
  }

  async create(originalUrl: string, userId?: string) {
    const url = await this.urlsRepo.save(
      this.urlsRepo.create({
        originalUrl,
        user: userId ? { id: userId } : undefined,
      }),
    );

    url.shortCode = this.generateShortCode(url.id);
    await this.urlsRepo.save(url);

    const data = {
      ...url,
      shortUrl: `${process.env.BASE_URL}/my/${url.shortCode}`,
    };

    await this.cacheManager.set(url.shortCode, data);

    return data;
  }

  async findByShortCode(shortCode: string) {
    const cached = await this.cacheManager.get<Url>(shortCode);
    if (cached) return cached;

    const url = await this.urlsRepo.findOne({
      where: { shortCode, deletedAt: IsNull() },
      relations: ['user'],
    });
    if (!url) throw new NotFoundException('URL not found');

    await this.cacheManager.set(shortCode, url);

    return url;
  }

  async incrementClicks(shortCode: string) {
    const url = await this.findByShortCode(shortCode);
    if (!url) throw new NotFoundException('URL not found');

    url.clicks += 1;
    await this.urlsRepo.save(url);
    return url;
  }

  async findUserUrls(userId: string) {
    const urls = await this.urlsRepo.find({
      where: { user: { id: userId }, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });

    urls?.forEach((url) => {
      url['shortUrl'] = `${process.env.BASE_URL}/my/${url.shortCode}`;
    });

    return urls;
  }

  async updateUrl(id: string, userId: string, newUrl: string) {
    const url = await this.urlsRepo.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['user'],
    });

    if (!url) throw new NotFoundException('URL not found');
    if (url.user?.id !== userId) throw new ForbiddenException('You cannot edit this URL');

    url.originalUrl = newUrl;
    await this.urlsRepo.save(url);

    await this.cacheManager.set(url.shortCode!, url);

    return url;
  }

  async softDelete(id: string, userId: string) {
    const url = await this.urlsRepo.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['user'],
    });

    if (!url) throw new NotFoundException('URL not found');
    if (url.user?.id !== userId) throw new ForbiddenException('You cannot delete this URL');

    url.deletedAt = new Date();
    await this.urlsRepo.save(url);

    await this.cacheManager.del(url.shortCode!);

    return url;
  }
}
