import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BackendApiService } from '../backend-api/backend-api.service';
import { ProductsService } from '../products/products.service';
import { UrlMappingConfigDto, SiteMappingDto } from './dto/url-mapping.dto';
import { ProductDto } from '../products/dto/product.dto';
import { LinkDto } from '../products/dto/product-links-onboarding.dto';

@Injectable()
export class ConfigService {
  private readonly baseConfig: Omit<UrlMappingConfigDto, 'mappings'> = {
    timeout: 5000,
    notifications: {
      messages: [
        'Hello! Ressources du devhub',
        'Nouveau guide disponible 📚',
        '3 mises à jour cette semaine',
        "Besoin d'aide ? Je suis là !",
        'Découvrez les nouveautés',
        'Documentation mise à jour',
      ],
      interval: {
        min: 10000,
        max: 30000,
      },
      displayDuration: 5000,
    },
    badge: {
      enabled: true,
      notifications: {
        count: 0,
        color: 'success',
      },
    },
    analytics: {
      enabled: true,
      endpoint: 'http://localhost:3000/api/analytics/events',
      debug: false,
    },
    defaults: {
      news: 'https://example.com',
      onboarding: 'https://example.com',
      help: 'https://example.com',
      team: 'https://example.com',
    },
  };

  constructor(
    private readonly backendApiService: BackendApiService,
    private readonly productsService: ProductsService,
  ) {}

  /**
   * Récupère la configuration du mapping d'URLs pour le widget
   */
  async getUrlMappingConfig(): Promise<UrlMappingConfigDto> {
    try {
      console.log('🔍 [ConfigService] Fetching products...');
      const products = await this.fetchAllProducts();
      console.log(`📦 [ConfigService] Received ${products.length} products`);
      
      if (products.length > 0) {
        console.log('📋 [ConfigService] First product FULL STRUCTURE:', JSON.stringify(products[0], null, 2));
        console.log('\n📋 [ConfigService] First product keys:', Object.keys(products[0]));
        console.log('📋 [ConfigService] Has links property:', 'links' in products[0]);
        console.log('📋 [ConfigService] Links value:', products[0].links);
      }
      
      const mappings: Record<string, SiteMappingDto> = {};
      const defaults = this.baseConfig.defaults;
      let processedCount = 0;
      let skippedCount = 0;

      for (const product of products) {
        const links = Array.isArray(product.links) ? product.links : [];
        console.log(`\n🔗 [Product: ${product.name}] Links count: ${links.length}`);
        
        if (links.length > 0) {
          console.log(`   Link types: ${links.map(l => `"${l.type}"`).join(', ')}`);
          console.log(`   Link labels: ${links.map(l => `"${l.label}"`).join(', ')}`);
        }
        
        // Recherche flexible: app_url, appUrl, application, website, site, url, etc.
        const appUrlLink = this.findLinkByTypeOrLabel(links, [
          'app_url', 'appUrl', 'app-url', 'application', 'application_url',
          'website', 'site', 'web', 'url', 'link', 'app'
        ]);
        console.log(`🎯 [Product: ${product.name}] app_url link found:`, appUrlLink ? `YES (type: "${appUrlLink.type}", ${appUrlLink.url?.substring(0, 50)}...)` : 'NO');
        
        const hostname = this.extractHostname(appUrlLink?.url);
        console.log(`🌐 [Product: ${product.name}] Extracted hostname:`, hostname ?? 'null');

        if (!hostname) {
          skippedCount++;
          console.log(`⏭️  [Product: ${product.name}] SKIPPED - No hostname`);
          continue;
        }
        
        processedCount++;

        const helpLink = this.findLinkByTypeOrLabel(links, [
          'support',
          'help',
          'documentation',
        ]);
        const teamLink = this.findLinkByTypeOrLabel(links, ['tangram', 'team']);

        mappings[hostname] = {
          news: `https://devhub.adeo.cloud/product-overview/${product._id}`,
          onboarding: product.onboardingModule?._id
            ? `https://devhub.adeo.cloud/media-tech/${product.onboardingModule._id}`
            : defaults.onboarding,
          help: helpLink?.url ?? defaults.help,
          team: teamLink?.url ?? defaults.team,
        };
        console.log(`✅ [Product: ${product.name}] Mapping created for hostname: ${hostname}`);
      }

      console.log(`\n📊 [ConfigService] Summary:`);
      console.log(`   - Total products: ${products.length}`);
      console.log(`   - Processed: ${processedCount}`);
      console.log(`   - Skipped: ${skippedCount}`);
      console.log(`   - Mappings created: ${Object.keys(mappings).length}`);
      console.log(`   - Hostnames: [${Object.keys(mappings).join(', ')}]`);

      return {
        ...this.baseConfig,
        mappings,
      };
    } catch (error) {
      console.error('❌ [ConfigService] Error building URL mapping:', error);
      throw new InternalServerErrorException(
        `Failed to build URL mapping configuration: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private async fetchProductDetails(productId: string): Promise<ProductDto> {
    try {
      return await this.productsService.findOne(productId);
    } catch (error) {
      console.warn(`⚠️ [fetchProductDetails] Failed to fetch details for product ${productId}:`, error.message);
      throw error;
    }
  }

  private async fetchAllProducts(): Promise<ProductDto[]> {
    const limit = 100;
    let page = 1;

    console.log(`🌐 [fetchAllProducts] Step 1: Fetching product list from /products`);
    const firstResponse = await this.backendApiService.get<any>(
      `/products?page=${page}&limit=${limit}`,
    );
    console.log(`📥 [fetchAllProducts] Raw response type: ${Array.isArray(firstResponse) ? 'Array' : 'Object'}`);
    
    const firstParsed = this.parseProductsResponse(firstResponse);
    console.log(`📦 [fetchAllProducts] Step 1 complete: ${firstParsed.items.length} products listed`);

    if (firstParsed.isArray) {
      return firstParsed.items;
    }

    const allProducts = [...firstParsed.items];
    const total = firstParsed.total;

    if (!total || allProducts.length >= total || firstParsed.items.length < limit) {
      return allProducts;
    }

    const maxPages = 1000;
    while (allProducts.length < total && page < maxPages) {
      page += 1;
      const response = await this.backendApiService.get<any>(
        `/products?page=${page}&limit=${limit}`,
      );
      const parsed = this.parseProductsResponse(response);

      if (parsed.isArray) {
        return parsed.items;
      }

      if (!parsed.items.length) {
        break;
      }

      allProducts.push(...parsed.items);

      if (!parsed.total && parsed.items.length < limit) {
        break;
      }
    }

    console.log(`📦 [fetchAllProducts] Step 2: Fetching detailed info for ${allProducts.length} products...`);
    
    // Récupérer les détails complets pour chaque produit (avec links)
    const productsWithDetails: ProductDto[] = [];
    let fetchedCount = 0;
    
    for (const product of allProducts) {
      try {
        const detailedProduct = await this.fetchProductDetails(product._id);
        productsWithDetails.push(detailedProduct);
        fetchedCount++;
        
        if (fetchedCount % 10 === 0) {
          console.log(`   ⏳ Fetched ${fetchedCount}/${allProducts.length} product details...`);
        }
      } catch (error) {
        console.warn(`   ⚠️ Skipping product ${product.name} (${product._id}) - failed to fetch details`);
        // Continue sans ce produit plutôt que de tout arrêter
      }
    }
    
    console.log(`✅ [fetchAllProducts] Step 2 complete: ${productsWithDetails.length} products with full details`);
    return productsWithDetails;
  }

  private parseProductsResponse(response: any): {
    items: ProductDto[];
    total?: number;
    isArray: boolean;
  } {
    if (Array.isArray(response)) {
      return { items: response, isArray: true };
    }

    if (response && typeof response === 'object') {
      let items: ProductDto[] = [];

      if (Array.isArray(response.items)) {
        items = response.items;
      } else if (Array.isArray(response.data)) {
        items = response.data;
      }

      const total = typeof response.total === 'number' ? response.total : undefined;

      return { items, total, isArray: false };
    }

    return { items: [], isArray: false };
  }

  private findLinkByTypeOrLabel(links: LinkDto[], candidates: string[]): LinkDto | undefined {
    const normalizedCandidates = new Set(
      candidates.map((candidate) => this.normalize(candidate)),
    );
    
    const found = links.find((link) => {
      const type = this.normalize(link.type);
      const label = this.normalize(link.label);
      const matches = normalizedCandidates.has(type) || normalizedCandidates.has(label);
      
      if (candidates.includes('app_url')) {
        console.log(`      🔎 Checking link: type="${link.type}" (normalized: "${type}"), label="${link.label}" (normalized: "${label}") => ${matches ? '✅ MATCH' : '❌ no match'}`);
      }
      
      return matches;
    });
    
    return found;
  }

  private normalize(value?: string): string {
    return (value ?? '').trim().toLowerCase();
  }

  private extractHostname(url?: string): string | null {
    if (!url) {
      return null;
    }

    try {
      const parsed = new URL(url);
      return parsed.hostname || null;
    } catch {
      return null;
    }
  }
}
