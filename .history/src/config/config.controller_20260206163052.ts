import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from './config.service';
import { UrlMappingConfigDto } from './dto/url-mapping.dto';

@ApiTags('config')
@Controller('config')
@UseInterceptors(CacheInterceptor)
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('url-mapping')
  @ApiOperation({ summary: 'Récupère la configuration du mapping d\'URLs pour le widget' })
  @ApiResponse({ 
    status: 200, 
    description: 'Configuration récupérée avec succès', 
    type: UrlMappingConfigDto 
  })
  @ApiResponse({ status: 500, description: 'Erreur lors de la récupération de la configuration' })
  async getUrlMapping(): Promise<UrlMappingConfigDto> {
    return this.configService.getUrlMappingConfig();
  }
}
