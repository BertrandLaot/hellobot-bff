import { ApiProperty } from '@nestjs/swagger';

export class UserMetaDto {
  @ApiProperty({ description: 'Date de dernière modification', example: '2024-01-15T10:30:00Z' })
  lastModified: string;

  @ApiProperty({ description: 'Date de création', example: '2024-01-01T08:00:00Z' })
  created: string;

  @ApiProperty({ description: 'Emplacement', example: 'Paris, France' })
  location: string;
}
