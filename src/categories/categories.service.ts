import { Injectable } from '@nestjs/common';
import { BackendApiService } from '../backend-api/backend-api.service';
import { CategoryResponseDto } from './dto/category-response.dto';
import { BeginnerCategoryResponseDto } from './dto/beginner-category-response.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly backendApiService: BackendApiService) {}

  /**
   * Récupère toutes les catégories
   */
  async getAllCategories(): Promise<CategoryResponseDto[]> {
    return this.backendApiService.get<CategoryResponseDto[]>('/categories');
  }

  /**
   * Récupère les catégories pour débutants avec le nombre de modules
   */
  async getBeginnerCategories(): Promise<BeginnerCategoryResponseDto[]> {
    return this.backendApiService.get<BeginnerCategoryResponseDto[]>('/categories/beginner');
  }

  /**
   * Récupère une catégorie par son ID
   */
  async getCategoryById(id: string): Promise<CategoryResponseDto> {
    return this.backendApiService.get<CategoryResponseDto>(`/categories/${id}`);
  }
}
