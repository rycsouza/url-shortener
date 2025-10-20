import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt.guard';

import type { Response } from 'express';

import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { UrlsService } from './urls.service';
import { JwtOptionalAuthGuard } from 'src/auth/jwt-optional.guard';
import { UrlResponseDto } from './dto/response/url-response.dto';
import { DeletedUrlResponseDto } from './dto/response/deleted-url-response.dto';

@ApiTags('URLs')
@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @UseGuards(JwtOptionalAuthGuard)
  @Post('urls')
  @ApiOperation({
    summary: 'Cria uma nova URL encurtada',
    description:
      'Cria um novo registro de URL. Se o token JWT for enviado, a URL será associada ao usuário autenticado.',
  })
  @ApiResponse({
    status: 201,
    description: 'URL encurtada com sucesso',
    type: UrlResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'URL inválida ou payload incorreto',
  })
  async create(@Body() dto: CreateUrlDto, @Req() req: any) {
    const userId = req.user?.userId;
    const url = await this.urlsService.create(dto.originalUrl, userId);
    return url;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('urls')
  @ApiOperation({
    summary: 'Lista todas as URLs do usuário autenticado.',
    description:
      'Retorna todas as URLs criadas pelo usuário com contagem de cliques.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de URLs retornada com sucesso.',
    type: [UrlResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Token JWT ausente ou inválido' })
  async findUserUrls(@Req() req: any) {
    return await this.urlsService.findUserUrls(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('urls/:id')
  @ApiOperation({ summary: 'Atualiza o destino de uma URL encurtada' })
  @ApiResponse({
    status: 200,
    type: UrlResponseDto,
    description: 'URL atualizada com sucesso',
  })
  @ApiResponse({
    status: 403,
    description: 'Usuário não autorizado a editar esta URL',
  })
  @ApiResponse({ status: 404, description: 'URL não encontrada' })
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
  @ApiOperation({ summary: 'Deleta logicamente uma URL encurtada' })
  @ApiResponse({
    status: 200,
    type: DeletedUrlResponseDto,
    description: 'URL deletada logicamente com sucesso',
  })
  @ApiResponse({ status: 403, description: 'Usuário não autorizado a deletar esta URL' })
  @ApiResponse({ status: 404, description: 'URL não encontrada' })
  async remove(@Param('id') id: string, @Req() req: any) {
    return await this.urlsService.softDelete(id, req.user.userId);
  }

  @Get('my/:shortCode')
  @ApiOperation({
    summary: 'Redireciona para o link original',
    description:
      'Busca o shortCode informado, contabiliza o clique e redireciona o usuário para o link original.',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirecionamento realizado com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'URL não encontrada.',
  })
  async redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
    const url = await this.urlsService.incrementClicks(shortCode);
    return res.redirect(url.originalUrl);
  }
}
