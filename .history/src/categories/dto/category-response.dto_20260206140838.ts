import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ description: 'ID de la catégorie', example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiProperty({ description: 'Label de la catégorie', example: 'Web Development' })
  label: string;
}
