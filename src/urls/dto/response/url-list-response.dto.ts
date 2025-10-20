import { ApiProperty } from '@nestjs/swagger';

import { UrlResponseDto } from './url-response.dto';

export class UrlListResponseDto {
  @ApiProperty({ type: [UrlResponseDto] })
  urls: UrlResponseDto[];
}
