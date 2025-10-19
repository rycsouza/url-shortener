import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt.guard';

import type { Response } from 'express';

import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { UrlsService } from './urls.service';
import { JwtOptionalAuthGuard } from 'src/auth/jwt-optional.guard';

@ApiTags('URLs')
@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @ApiOperation({ summary: 'Cria uma URL encurtada (token opcional)' })
  @ApiBearerAuth()
  @UseGuards(JwtOptionalAuthGuard)
  @Post('urls')
  async create(@Body() dto: CreateUrlDto, @Req() req: any) {
    const userId = req.user?.userId;
    const url = await this.urlsService.create(dto.originalUrl, userId);
    return url;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('urls')
  async findUserUrls(@Req() req: any) {
    return await this.urlsService.findUserUrls(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('urls/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUrlDto,
    @Req() req: any,
  ) {
    return await this.urlsService.updateUrl(id, req.user.userId, dto.newUrl);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('urls/:id')
  async remove(@Param('id') id: string, @Req() req: any) {
    return await this.urlsService.softDelete(id, req.user.userId);
  }

  @Get('my/:shortCode')
  async redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
    const url = await this.urlsService.incrementClicks(shortCode);
    return res.redirect(url.originalUrl);
  }
}
