import { ApiProperty } from '@nestjs/swagger';

export class DeletedUrlResponseDto {
  @ApiProperty({ example: 'c94a1e3a-324b-11ee-be56-0242ac120002' })
  id: string;

  @ApiProperty({ example: '2025-10-20T14:30:00.000Z' })
  deletedAt: Date;
}
