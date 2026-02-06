import { Injectable, NotFoundException } from '@nestjs/common';
import { BackendApiService } from '../backend-api/backend-api.service';
import { ProductDto } from './dto/product.dto';
import { ProductWithModulesDto, ModuleLightDto } from './dto/product-with-modules.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly backendApiService: BackendApiService) {}

  /**
   * Récupère un produit par son ID depuis l'API backend
   */
  async findOne(id: string): Promise<ProductDto> {
    try {
      const product = await this.backendApiService.get<ProductDto>(`/products/${id}`);
      return product;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * Récupère un produit avec tous ses modules liés (route d'agrégation)
   */
  async findOneWithModules(id: string): Promise<ProductWithModulesDto> {
    try {
      // Appel parallèle pour récupérer le produit et ses modules
      const [product, modules] = await Promise.all([
        this.backendApiService.get<ProductDto>(`/products/${id}`),
        this.backendApiService.get<ModuleLightDto[]>(`/products/${id}/modules`),
      ]);

      return {
        product,
        modules,
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      throw error;
    }
  }
}
