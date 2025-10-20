import { ApiProperty } from '@nestjs/swagger';

import { User } from '../../../users/user.entity';

export class UrlResponseDto {
  @ApiProperty({ example: 'a8b3c1e0-0c64-11ef-baa3-0242ac120002' })
  id: string;

  @ApiProperty({ example: 'https://google.com' })
  originalUrl: string;

  @ApiProperty({ example: 'AbC123' })
  shortCode: string;

  @ApiProperty({ example: 'http://localhost:3000/AbC123' })
  shortUrl: string;

  @ApiProperty({ example: 10 })
  clicks: number;

  @ApiProperty({ example: '2025-10-20T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-10-20T12:30:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ example: null, nullable: true })
  deletedAt?: Date;

  @ApiProperty({
    example: { id: 'b2a99cc6-0c64-11ef-baa3-0242ac120002' },
    nullable: true,
  })
  user?: Partial<User>;
}
