import { Injectable, NotFoundException } from '@nestjs/common';
import { BackendApiService } from '../backend-api/backend-api.service';
import { ModuleDto } from './dto/module.dto';
import { ModuleQueryDto } from './dto/module-query.dto';

@Injectable()
export class ModulesService {
  constructor(private readonly backendApiService: BackendApiService) {}

  /**
   * Récupère un module par son ID depuis l'API backend
   */
  async findOne(id: string): Promise<ModuleDto> {
    try {
      const module = await this.backendApiService.get<ModuleDto>(`/modules/${id}`);
      return module;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Module with ID ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * Récupère tous les modules avec filtres et pagination
   */
  async getAllModules(query: ModuleQueryDto): Promise<any> {
    // Construction des query params pour l'API backend
    const params = new URLSearchParams();
    
    params.append('page', query.page.toString());
    params.append('limit', query.limit.toString());
    
    if (query.onlySelectedUniverse !== undefined) {
      params.append('onlySelectedUniverse', query.onlySelectedUniverse.toString());
    }
    if (query.query) {
      params.append('query', query.query);
    }
    if (query.status) {
      params.append('status', query.status);
    }
    if (query.allStatuses !== undefined) {
      params.append('allStatuses', query.allStatuses.toString());
    }
    if (query.noPlaylists !== undefined) {
      params.append('noPlaylists', query.noPlaylists.toString());
    }
    if (query.owner) {
      params.append('owner', query.owner);
    }
    if (query.mostViewed !== undefined) {
      params.append('mostViewed', query.mostViewed.toString());
    }
    if (query.lastUpdated !== undefined) {
      params.append('lastUpdated', query.lastUpdated.toString());
    }
    if (query.lastReviewDate !== undefined) {
      params.append('lastReviewDate', query.lastReviewDate.toString());
    }
    if (query.sortBy) {
      params.append('sortBy', query.sortBy);
    }
    if (query.sortOrder) {
      params.append('sortOrder', query.sortOrder);
    }
    if (query.product) {
      params.append('product', query.product);
    }
    if (query.type) {
      params.append('type', query.type);
    }
    if (query.level) {
      params.append('level', query.level);
    }

    // Tableaux
    query.categories.forEach(cat => params.append('categories[]', cat));
    query.levels.forEach(lvl => params.append('levels[]', lvl));
    query.types.forEach(type => params.append('types[]', type));
    query.duration.forEach(dur => params.append('duration[]', dur));
    query.langKeys.forEach(lang => params.append('langKeys[]', lang));

    return this.backendApiService.get(`/modules?${params.toString()}`);
  }

  /**
   * Récupère les X derniers modules
   */
  async getLatestModules(limit: number, universeId?: string): Promise<any[]> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (universeId) {
      params.append('universeId', universeId);
    }
    
    return this.backendApiService.get(`/modules/latest?${params.toString()}`);
  }

  /**
   * Récupère les 10 modules les plus populaires
   */
  async getPopularModules(universeId?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (universeId) {
      params.append('universeId', universeId);
    }
    
    return this.backendApiService.get(`/modules/popular?${params.toString()}`);
  }

  /**
   * Récupère les modules transférés
   */
  async getForwardedModules(universeId?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (universeId) {
      params.append('universeId', universeId);
    }
    
    return this.backendApiService.get(`/modules/forwarded?${params.toString()}`);
  }
}
