import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20ifQ.kHTyUjKz8qA9_XzUO07fEcjz9ZkD8k_MX8gkD8q2r2A',
    description: 'Token JWT de acesso para autenticação nas rotas privadas',
  })
  access_token: string;
}
