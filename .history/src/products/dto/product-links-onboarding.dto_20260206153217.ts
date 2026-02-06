import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

/**
 * DTO représentant un lien associé à un produit
 */
export class LinkDto {
  @ApiProperty({ description: 'Label du lien', example: 'Documentation' })
  @IsString()
  label: string;

  @ApiProperty({ description: 'URL du lien', example: 'https://docs.example.com' })
  @IsString()
  url: string;

  @ApiProperty({ description: 'Type de lien', example: 'documentation', required: false })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ description: 'ID du lien', required: false })
  @IsString()
  @IsOptional()
  _id?: string;
}

/**
 * DTO représentant une version légère du module d'onboarding
 */
export class OnboardingModuleLightDto {
  @ApiProperty({ description: 'ID du module d\'onboarding' })
  @IsString()
  _id: string;

  @ApiProperty({ description: 'Nom du module' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Type de module' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Durée estimée en minutes', required: false })
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiProperty({ description: 'URL de l\'image de couverture', required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ description: 'Niveau de difficulté', required: false })
  @IsString()
  @IsOptional()
  level?: string;

  @ApiProperty({ description: 'Statut du module', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ description: 'Indique si le module est obligatoire', required: false })
  @IsOptional()
  mandatory?: boolean;
}

/**
 * DTO représentant la réponse de l'endpoint liens et onboarding d'un produit
 */
export class ProductLinksAndOnboardingDto {
  @ApiProperty({ 
    description: 'Liens associés au produit', 
    type: [LinkDto],
    example: [
      { label: 'Documentation', url: 'https://docs.example.com', type: 'documentation' },
      { label: 'Support', url: 'https://support.example.com', type: 'support' }
    ]
  })
  links: LinkDto[];

  @ApiProperty({ 
    description: 'Module d\'onboarding associé au produit', 
    type: OnboardingModuleLightDto,
    required: false 
  })
  @IsOptional()
  onboardingModule?: OnboardingModuleLightDto;
}
