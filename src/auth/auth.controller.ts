import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginResponseDto } from './dto/response/login-response.dto';
import { RegisterResponseDto } from './dto/response/register-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar um novo usuário' })
  @ApiResponse({
    status: 201,
    type: RegisterResponseDto,
    description: 'Usuário criado com sucesso!',
  })
  @ApiBadRequestResponse({
    description: 'Usuário já existe ou dados inválidos.',
  })
  async register(@Body() dto: RegisterDto) {
    return await this.authService.register(dto.email, dto.name, dto.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Realizar login e obter token JWT' })
  @ApiResponse({
    status: 200,
    type: LoginResponseDto,
    description: 'Login realizado com sucesso!',
  })
  @ApiBadRequestResponse({
    description: 'Email e Password são obrigatórios.',
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciais inválidas.',
  })
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto.email, dto.password);
  }
}
