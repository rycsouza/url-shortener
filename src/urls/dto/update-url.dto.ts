import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class UpdateUrlDto {
  @ApiProperty({ example: 'https://youtube.com' })
  @IsUrl()
  newUrl: string;
}
