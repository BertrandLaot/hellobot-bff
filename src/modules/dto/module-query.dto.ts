import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsBoolean, IsString, IsArray, IsEnum, Min } from 'class-validator';

export class ModuleQueryDto {
  @ApiProperty({ description: 'Numéro de page (1-based)', example: 1, minimum: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number;

  @ApiProperty({ description: 'Nombre d\'éléments par page', example: 10, minimum: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number;

  @ApiPropertyOptional({ description: 'Filtrer uniquement par univers sélectionné', example: false })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  onlySelectedUniverse?: boolean;

  @ApiPropertyOptional({ description: 'Recherche textuelle', example: 'TypeScript' })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiProperty({ description: 'Filtrer par catégories', type: [String], example: ['web', 'backend'] })
  @IsArray()
  categories: string[];

  @ApiProperty({ description: 'Filtrer par niveaux', type: [String], example: ['beginner', 'intermediate'] })
  @IsArray()
  levels: string[];

  @ApiProperty({ description: 'Filtrer par types', type: [String], example: ['video', 'article'] })
  @IsArray()
  types: string[];

  @ApiProperty({ description: 'Filtrer par durée', type: [String], example: ['short', 'medium'] })
  @IsArray()
  duration: string[];

  @ApiProperty({ description: 'Filtrer par langues', type: [String], example: ['fr', 'en'] })
  @IsArray()
  langKeys: string[];

  @ApiPropertyOptional({ description: 'Filtrer par statut', example: 'published' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Afficher tous les statuts', example: false })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  allStatuses?: boolean;

  @ApiPropertyOptional({ description: 'Exclure les playlists', example: false })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  noPlaylists?: boolean;

  @ApiPropertyOptional({ description: 'Filtrer par propriétaire', example: 'user@example.com' })
  @IsOptional()
  @IsString()
  owner?: string;

  @ApiPropertyOptional({ description: 'Trier par popularité', example: false })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  mostViewed?: boolean;

  @ApiPropertyOptional({ description: 'Trier par dernière mise à jour', example: false })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  lastUpdated?: boolean;

  @ApiPropertyOptional({ description: 'Trier par dernière date de review', example: false })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  lastReviewDate?: boolean;

  @ApiPropertyOptional({ description: 'Champ de tri', example: 'createdAt', enum: ['createdAt', 'title', 'viewCount'] })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Ordre de tri', example: 'desc', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({ description: 'Filtrer par produit', example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsString()
  product?: string;

  @ApiPropertyOptional({ description: 'Filtrer par type spécifique', example: 'video' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ description: 'Filtrer par niveau spécifique', example: 'beginner' })
  @IsOptional()
  @IsString()
  level?: string;
}
