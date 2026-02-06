import { ApiProperty } from '@nestjs/swagger';

export class UniverseLightDto {
  @ApiProperty({ description: 'ID de l\'univers', example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiProperty({ description: 'Nom de l\'univers', example: 'Tech Universe' })
  name: string;

  @ApiProperty({ description: 'Description', example: 'Univers technologique' })
  description?: string;
}
