import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({
    example: 'd3a4c1b8-5678-4f2b-b9df-77dbe9fa82c1',
    description: 'Identificador único do usuário recém-criado',
  })
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'E-mail do usuário registrado',
  })
  email: string;
}
