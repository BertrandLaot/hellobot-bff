import { ApiProperty } from '@nestjs/swagger';

export class NotificationsConfigDto {
  @ApiProperty({ description: 'Messages de notification', type: [String] })
  messages: string[];

  @ApiProperty({ description: 'Configuration de l\'intervalle de notification' })
  interval: {
    min: number;
    max: number;
  };

  @ApiProperty({ description: 'Durée d\'affichage en millisecondes' })
  displayDuration: number;
}

export class BadgeConfigDto {
  @ApiProperty({ description: 'Badge activé ou non' })
  enabled: boolean;

  @ApiProperty({ description: 'Configuration des notifications du badge' })
  notifications: {
    count: number;
    color: string;
  };
}

export class AnalyticsConfigDto {
  @ApiProperty({ description: 'Analytics activé ou non' })
  enabled: boolean;

  @ApiProperty({ description: 'Endpoint de l\'API analytics' })
  endpoint: string;

  @ApiProperty({ description: 'Mode debug' })
  debug: boolean;
}

export class DefaultUrlsDto {
  @ApiProperty({ description: 'URL par défaut pour les news' })
  news: string;

  @ApiProperty({ description: 'URL par défaut pour l\'onboarding' })
  onboarding: string;

  @ApiProperty({ description: 'URL par défaut pour l\'aide' })
  help: string;

  @ApiProperty({ description: 'URL par défaut pour l\'équipe' })
  team: string;
}

export class SiteMappingDto {
  @ApiProperty({ description: 'URL de la page news/product overview' })
  news: string;

  @ApiProperty({ description: 'URL de la page onboarding' })
  onboarding: string;

  @ApiProperty({ description: 'URL de la page d\'aide' })
  help: string;

  @ApiProperty({ description: 'URL de la page équipe' })
  team: string;
}

export class UrlMappingConfigDto {
  @ApiProperty({ description: 'Timeout en millisecondes' })
  timeout: number;

  @ApiProperty({ description: 'Configuration des notifications', type: NotificationsConfigDto })
  notifications: NotificationsConfigDto;

  @ApiProperty({ description: 'Configuration du badge', type: BadgeConfigDto })
  badge: BadgeConfigDto;

  @ApiProperty({ description: 'Configuration analytics', type: AnalyticsConfigDto })
  analytics: AnalyticsConfigDto;

  @ApiProperty({ description: 'URLs par défaut', type: DefaultUrlsDto })
  defaults: DefaultUrlsDto;

  @ApiProperty({ 
    description: 'Mappings des URLs par hostname',
    type: 'object',
    additionalProperties: { type: 'object' }
  })
  mappings: Record<string, SiteMappingDto>;
}
