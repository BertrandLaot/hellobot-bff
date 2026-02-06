import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';
import { ProductWithModulesDto } from './dto/product-with-modules.dto';
import { ProductLinksAndOnboardingDto } from './dto/product-links-onboarding.dto';

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

  @Get(':id/with-modules')
  @ApiOperation({ summary: 'Récupère un produit avec tous ses modules liés' })
  @ApiParam({ name: 'id', description: 'ID du produit', type: String })
  @ApiResponse({ 
    status: 200, 
    description: 'Produit et modules récupérés avec succès', 
    type: ProductWithModulesDto 
  })
  @ApiResponse({ status: 404, description: 'Produit non trouvé' })
  async findOneWithModules(@Param('id') id: string): Promise<ProductWithModulesDto> {
    return this.productsService.findOneWithModules(id);
  }

  @Get(':id/links-and-onboarding')
  @ApiOperation({ summary: 'Récupère les liens et le module d\'onboarding d\'un produit' })
  @ApiParam({ name: 'id', description: 'ID du produit', type: String })
  @ApiResponse({ 
    status: 200, 
    description: 'Liens et onboarding récupérés avec succès', 
    type: ProductLinksAndOnboardingDto 
  })
  @ApiResponse({ status: 404, description: 'Produit non trouvé' })
  async findLinksAndOnboarding(@Param('id') id: string): Promise<ProductLinksAndOnboardingDto> {
    return this.productsService.findLinksAndOnboarding(id);
  }
}
