import { Injectable, NotFoundException } from '@nestjs/common';
import { BackendApiService } from '../backend-api/backend-api.service';
import { ProductDto } from './dto/product.dto';

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
}
