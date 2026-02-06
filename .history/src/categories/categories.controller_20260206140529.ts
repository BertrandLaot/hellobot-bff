import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CategoryResponseDto } from './dto/category-response.dto';
import { BeginnerCategoryResponseDto } from './dto/beginner-category-response.dto';

@ApiTags('categories')
@Controller('categories')
@UseInterceptors(CacheInterceptor)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Récupère toutes les catégories' })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste de toutes les catégories', 
    type: [CategoryResponseDto] 
  })
  async getAllCategories(): Promise<CategoryResponseDto[]> {
    return this.categoriesService.getAllCategories();
  }

  @Get('beginner')
  @ApiOperation({ summary: 'Récupère les catégories pour débutants avec le nombre de modules' })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste des catégories débutant avec comptage de modules', 
    type: [BeginnerCategoryResponseDto] 
  })
  async getBeginnerCategories(): Promise<BeginnerCategoryResponseDto[]> {
    return this.categoriesService.getBeginnerCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupère une catégorie par son ID' })
  @ApiParam({ name: 'id', description: 'ID de la catégorie (MongoDB ObjectId)', type: String, example: '507f1f77bcf86cd799439011' })
  @ApiResponse({ 
    status: 200, 
    description: 'Catégorie récupérée avec succès', 
    type: CategoryResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Catégorie non trouvée' })
  async getCategoryById(@Param('id') id: string): Promise<CategoryResponseDto> {
    return this.categoriesService.getCategoryById(id);
  }
}
