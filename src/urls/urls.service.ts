import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { IsNull, Repository } from 'typeorm';

import { Url } from './url.entity';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private readonly urlsRepo: Repository<Url>,
  ) {}

  private generateShortCode(): string {
    return randomBytes(3).toString('base64url');
  }

  async create(originalUrl: string, userId?: string) {
    let shortCode = this.generateShortCode();

    while (
      await this.urlsRepo.findOne({ where: { shortCode, deletedAt: IsNull() } })
    )
      shortCode = this.generateShortCode();

    const url = this.urlsRepo.create({
      originalUrl,
      shortCode,
      user: userId ? { id: userId } : undefined,
    });

    return {
      ...(await this.urlsRepo.save(url)),
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
    return this.urlsRepo.save(url);
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
