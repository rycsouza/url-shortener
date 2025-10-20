import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { IsNull, Repository } from 'typeorm';

import { UrlResponseDto } from './dto/response/url-response.dto';
import { Url } from './url.entity';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private readonly urlsRepo: Repository<Url>,
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
    return {
      ...url,
      shortUrl: `${process.env.BASE_URL}/my/${url.shortCode}`,
    };
  }

  async findByShortCode(shortCode: string) {
    const url = await this.urlsRepo.findOne({
      where: { shortCode, deletedAt: IsNull() },
      relations: ['user'],
    });

    if (!url) throw new NotFoundException('URL not found');
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
    if (url.user?.id !== userId)
      throw new ForbiddenException('You cannot edit this URL');

    url.originalUrl = newUrl;
    return await this.urlsRepo.save(url);
  }

  async softDelete(id: string, userId: string) {
    const url = await this.urlsRepo.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['user'],
    });

    if (!url) throw new NotFoundException('URL not found');
    if (url.user?.id !== userId)
      throw new ForbiddenException('You cannot delete this URL');

    url.deletedAt = new Date();
    return await this.urlsRepo.save(url);
  }
}
