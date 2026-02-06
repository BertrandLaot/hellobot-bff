import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsNumber, IsBoolean } from 'class-validator';

export class ProductDto {
  @ApiProperty({ description: 'ID du produit' })
  @IsString()
  _id: string;

  @ApiProperty({ description: 'Nom du produit' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description du produit', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Statut du produit', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ description: 'URL de l\'icône', required: false })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ description: 'URL de la couverture', required: false })
  @IsString()
  @IsOptional()
  cover?: string;

  @ApiProperty({ description: 'Liens associés', required: false })
  @IsArray()
  @IsOptional()
  links?: any[];

  @ApiProperty({ description: 'Suggestions associées', required: false })
  @IsArray()
  @IsOptional()
  suggestions?: any[];

  @ApiProperty({ description: 'Tags', required: false })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: 'Propriétaires', required: false })
  @IsArray()
  @IsOptional()
  owners?: string[];

  @ApiProperty({ description: 'ID de l\'univers', required: false })
  @IsString()
  @IsOptional()
  universeId?: string;

  @ApiProperty({ description: 'Date de création', required: false })
  @IsString()
  @IsOptional()
  createdAt?: string;

  @ApiProperty({ description: 'Date de mise à jour', required: false })
  @IsString()
  @IsOptional()
  updatedAt?: string;
}
