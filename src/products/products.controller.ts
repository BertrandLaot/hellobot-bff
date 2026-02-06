import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';

@ApiTags('products')
@Controller('products')
@UseInterceptors(CacheInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Récupère un produit par son ID' })
  @ApiParam({ name: 'id', description: 'ID du produit', type: String })
  @ApiResponse({ 
    status: 200, 
    description: 'Produit récupéré avec succès', 
    type: ProductDto 
  })
  @ApiResponse({ status: 404, description: 'Produit non trouvé' })
  async findOne(@Param('id') id: string): Promise<ProductDto> {
    return this.productsService.findOne(id);
  }
}
