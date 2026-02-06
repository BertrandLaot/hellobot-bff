import { Injectable, NotFoundException } from '@nestjs/common';
import { BackendApiService } from '../backend-api/backend-api.service';
import { ModuleDto } from './dto/module.dto';

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
}
