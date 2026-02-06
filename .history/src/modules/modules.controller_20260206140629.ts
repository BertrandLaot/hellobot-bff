import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ModulesService } from './modules.service';
import { ModuleDto } from './dto/module.dto';
import { ModuleQueryDto } from './dto/module-query.dto';

@ApiTags('modules')
@Controller('modules')
@UseInterceptors(CacheInterceptor)
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Get()
  @ApiOperation({ summary: 'Récupère tous les modules avec filtres et pagination' })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste paginée des modules avec métadonnées',
  })
  async getAllModules(@Query() query: ModuleQueryDto): Promise<any> {
    return this.modulesService.getAllModules(query);
  }

  @Get('latest')
  @ApiOperation({ summary: 'Récupère les X derniers modules' })
  @ApiQuery({ name: 'limit', description: 'Nombre de modules à récupérer', type: Number, example: 10 })
  @ApiQuery({ name: 'universeId', description: 'ID de l\'univers (optionnel)', required: false, type: String })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste des derniers modules',
    type: [ModuleDto]
  })
  async getLatestModules(
    @Query('limit') limit: number = 10,
    @Query('universeId') universeId?: string,
  ): Promise<any[]> {
    return this.modulesService.getLatestModules(limit, universeId);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Récupère les 10 modules les plus populaires' })
  @ApiQuery({ name: 'universeId', description: 'ID de l\'univers (optionnel)', required: false, type: String })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste des modules les plus populaires',
    type: [ModuleDto]
  })
  async getPopularModules(@Query('universeId') universeId?: string): Promise<any[]> {
    return this.modulesService.getPopularModules(universeId);
  }

  @Get('forwarded')
  @ApiOperation({ summary: 'Récupère les modules transférés' })
  @ApiQuery({ name: 'universeId', description: 'ID de l\'univers (optionnel)', required: false, type: String })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste des modules transférés',
    type: [ModuleDto]
  })
  async getForwardedModules(@Query('universeId') universeId?: string): Promise<any[]> {
    return this.modulesService.getForwardedModules(universeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupère un module par son ID' })
  @ApiParam({ name: 'id', description: 'ID du module', type: String })
  @ApiResponse({ 
    status: 200, 
    description: 'Module récupéré avec succès', 
    type: ModuleDto 
  })
  @ApiResponse({ status: 404, description: 'Module non trouvé' })
  async findOne(@Param('id') id: string): Promise<ModuleDto> {
    return this.modulesService.findOne(id);
  }
}
