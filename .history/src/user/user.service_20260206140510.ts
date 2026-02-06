import { Injectable } from '@nestjs/common';
import { BackendApiService } from '../backend-api/backend-api.service';
import { UserDto } from './dto/user.dto';
import { ModuleLightDto } from './dto/module-light.dto';
import { WatchLaterDto } from './dto/watch-later.dto';

@Injectable()
export class UserService {
  constructor(private readonly backendApiService: BackendApiService) {}

  /**
   * Récupère les informations globales d'un utilisateur
   */
  async getUserInformations(ldap: number): Promise<UserDto> {
    return this.backendApiService.get<UserDto>(`/user/${ldap}`);
  }

  /**
   * Récupère la liste des modules "À voir plus tard" d'un utilisateur
   */
  async getWatchLaterModules(ldap: string): Promise<ModuleLightDto[]> {
    return this.backendApiService.get<ModuleLightDto[]>(`/user/${ldap}/watchLater`);
  }

  /**
   * Ajoute un module à la liste "À voir plus tard"
   */
  async addWatchLaterModule(ldap: string, watchLaterDto: WatchLaterDto): Promise<ModuleLightDto[]> {
    return this.backendApiService.post<ModuleLightDto[]>(`/user/${ldap}/watchLater`, watchLaterDto);
  }

  /**
   * Retire un module de la liste "À voir plus tard"
   */
  async removeWatchLaterModule(ldap: string, moduleId: string): Promise<ModuleLightDto[]> {
    return this.backendApiService.delete<ModuleLightDto[]>(`/user/${ldap}/watchLater/${moduleId}`);
  }
}
