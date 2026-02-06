import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsNumber, IsBoolean } from 'class-validator';

export class ModuleDto {
  @ApiProperty({ description: 'ID du module' })
  @IsString()
  _id: string;

  @ApiProperty({ description: 'Titre du module' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description du module', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Type du module', required: false })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ description: 'Statut du module', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ description: 'Contenu du module', required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ description: 'Durée estimée en minutes', required: false })
  @IsNumber()
  @IsOptional()
  estimatedDuration?: number;

  @ApiProperty({ description: 'Tags associés', required: false })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: 'Catégories associées', required: false })
  @IsArray()
  @IsOptional()
  categories?: string[];

  @ApiProperty({ description: 'ID du produit parent', required: false })
  @IsString()
  @IsOptional()
  productId?: string;

  @ApiProperty({ description: 'URL de la couverture', required: false })
  @IsString()
  @IsOptional()
  cover?: string;

  @ApiProperty({ description: 'Auteur du module', required: false })
  @IsString()
  @IsOptional()
  author?: string;

  @ApiProperty({ description: 'Nombre de vues', required: false })
  @IsNumber()
  @IsOptional()
  views?: number;

  @ApiProperty({ description: 'Note moyenne', required: false })
  @IsNumber()
  @IsOptional()
  averageRating?: number;

  @ApiProperty({ description: 'Nombre de notes', required: false })
  @IsNumber()
  @IsOptional()
  ratingsCount?: number;

  @ApiProperty({ description: 'Est un guideline', required: false })
  @IsBoolean()
  @IsOptional()
  isGuideline?: boolean;

  @ApiProperty({ description: 'Date de création', required: false })
  @IsString()
  @IsOptional()
  createdAt?: string;

  @ApiProperty({ description: 'Date de mise à jour', required: false })
  @IsString()
  @IsOptional()
  updatedAt?: string;
}
