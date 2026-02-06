import { Controller, Get, Post, Delete, Param, Body, UseInterceptors, ParseIntPipe } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { ModuleLightDto } from './dto/module-light.dto';
import { WatchLaterDto } from './dto/watch-later.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':ldap')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Récupère les informations globales d\'un utilisateur' })
  @ApiParam({ name: 'ldap', description: 'LDAP de l\'utilisateur', type: Number, example: 123456 })
  @ApiResponse({ 
    status: 200, 
    description: 'Informations utilisateur récupérées avec succès', 
    type: UserDto 
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async getUserInformations(@Param('ldap', ParseIntPipe) ldap: number): Promise<UserDto> {
    return this.userService.getUserInformations(ldap);
  }

  @Get(':ldap/watchLater')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Récupère la liste des modules "À voir plus tard"' })
  @ApiParam({ name: 'ldap', description: 'LDAP de l\'utilisateur', type: String, example: '123456' })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste des modules à voir plus tard récupérée avec succès', 
    type: [ModuleLightDto] 
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async getWatchLaterModules(@Param('ldap') ldap: string): Promise<ModuleLightDto[]> {
    return this.userService.getWatchLaterModules(ldap);
  }

  @Post(':ldap/watchLater')
  @ApiOperation({ summary: 'Ajoute un module à la liste "À voir plus tard"' })
  @ApiParam({ name: 'ldap', description: 'LDAP de l\'utilisateur', type: String, example: '123456' })
  @ApiBody({ type: WatchLaterDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Module ajouté avec succès à la watchlist', 
    type: [ModuleLightDto] 
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 404, description: 'Utilisateur ou module non trouvé' })
  async addWatchLaterModule(
    @Param('ldap') ldap: string,
    @Body() watchLaterDto: WatchLaterDto,
  ): Promise<ModuleLightDto[]> {
    return this.userService.addWatchLaterModule(ldap, watchLaterDto);
  }

  @Delete(':ldap/watchLater/:moduleId')
  @ApiOperation({ summary: 'Retire un module de la liste "À voir plus tard"' })
  @ApiParam({ name: 'ldap', description: 'LDAP de l\'utilisateur', type: String, example: '123456' })
  @ApiParam({ name: 'moduleId', description: 'ID du module à retirer', type: String, example: '507f1f77bcf86cd799439011' })
  @ApiResponse({ 
    status: 200, 
    description: 'Module retiré avec succès de la watchlist', 
    type: [ModuleLightDto] 
  })
  @ApiResponse({ status: 404, description: 'Utilisateur ou module non trouvé' })
  async removeWatchLaterModule(
    @Param('ldap') ldap: string,
    @Param('moduleId') moduleId: string,
  ): Promise<ModuleLightDto[]> {
    return this.userService.removeWatchLaterModule(ldap, moduleId);
  }
}
