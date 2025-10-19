import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso!' })
  async register(@Body() dto: RegisterDto) {
    return await this.authService.register(dto.email, dto.name, dto.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Realizar login e obter token' })
  @ApiResponse({ status: 200, description: 'Login realiado com sucesso!' })
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto.email, dto.password);
  }
}
