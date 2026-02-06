import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ModuleLightDto {
  @ApiProperty({ description: 'ID du module', example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiProperty({ description: 'Titre du module', example: 'Introduction à TypeScript' })
  title: string;

  @ApiProperty({ description: 'Type de module', example: 'video', enum: ['video', 'article', 'playlist', 'guideline'] })
  type: string;

  @ApiPropertyOptional({ description: 'Niveau', example: 'beginner', enum: ['beginner', 'intermediate', 'advanced'] })
  level?: string;

  @ApiPropertyOptional({ description: 'Durée en minutes', example: 30 })
  duration?: number;

  @ApiPropertyOptional({ description: 'Description courte', example: 'Apprenez les bases de TypeScript' })
  description?: string;

  @ApiPropertyOptional({ description: 'URL de la miniature', example: 'https://...' })
  thumbnail?: string;

  @ApiPropertyOptional({ description: 'Statut du module', example: 'published' })
  status?: string;
}
