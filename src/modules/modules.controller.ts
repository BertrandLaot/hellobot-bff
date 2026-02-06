import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ModulesService } from './modules.service';
import { ModuleDto } from './dto/module.dto';

@ApiTags('modules')
@Controller('modules')
@UseInterceptors(CacheInterceptor)
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

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
