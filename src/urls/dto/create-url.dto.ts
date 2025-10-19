import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class CreateUrlDto {
  @ApiProperty({ example: 'https://instagram.com' })
  @IsUrl()
  originalUrl: string;
}
