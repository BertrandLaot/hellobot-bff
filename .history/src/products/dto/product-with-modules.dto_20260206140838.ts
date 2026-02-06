import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from './product.dto';

export class ModuleLightDto {
  @ApiProperty({ description: 'ID du module', example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiProperty({ description: 'Titre du module', example: 'Introduction à TypeScript' })
  title: string;

  @ApiProperty({ description: 'Type de module', example: 'video' })
  type: string;

  @ApiProperty({ description: 'Niveau', example: 'beginner' })
  level?: string;

  @ApiProperty({ description: 'Durée en minutes', example: 30 })
  duration?: number;

  @ApiProperty({ description: 'Description courte', example: 'Apprenez les bases de TypeScript' })
  description?: string;

  @ApiProperty({ description: 'Statut du module', example: 'published' })
  status?: string;
}

export class ProductWithModulesDto {
  @ApiProperty({ description: 'Détails du produit', type: ProductDto })
  product: ProductDto;

  @ApiProperty({ description: 'Modules liés au produit', type: [ModuleLightDto] })
  modules: ModuleLightDto[];
}
