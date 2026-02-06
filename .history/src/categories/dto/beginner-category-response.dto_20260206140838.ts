import { ApiProperty } from '@nestjs/swagger';
import { CategoryResponseDto } from './category-response.dto';

export class BeginnerCategoryResponseDto {
  @ApiProperty({ description: 'Catégorie', type: CategoryResponseDto })
  category: CategoryResponseDto;

  @ApiProperty({ description: 'Nombre de modules dans cette catégorie', example: 15 })
  nbModules: number;
}
