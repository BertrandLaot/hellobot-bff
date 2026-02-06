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
      const products = await this.fetchAllProducts();
      const mappings: Record<string, SiteMappingDto> = {};
      const defaults = this.baseConfig.defaults;

      for (const product of products) {
        const links = Array.isArray(product.links) ? product.links : [];
        
        // Recherche flexible: app_url, appUrl, application, website, site, url, etc.
        const appUrlLink = this.findLinkByTypeOrLabel(links, [
          'app_url', 'appUrl', 'app-url', 'application', 'application_url',
          'website', 'site', 'web', 'url', 'link', 'app'
        ]);
        
        const hostname = this.extractHostname(appUrlLink?.url);

        if (!hostname) {
          continue;
        }

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
      }

      return {
        ...this.baseConfig,
        mappings,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to build URL mapping configuration: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private async fetchProductDetails(productId: string): Promise<ProductDto> {
    return await this.productsService.findOne(productId);
  }

  private async fetchAllProducts(): Promise<ProductDto[]> {
    const limit = 100;
    let page = 1;

    const firstResponse = await this.backendApiService.get<any>(
      `/products?page=${page}&limit=${limit}`,
    );
    
    const firstParsed = this.parseProductsResponse(firstResponse);

    let allProducts = [...firstParsed.items];

    // Si c'est un array simple ou si on a déjà tous les produits, on ne pagine pas
    if (!firstParsed.isArray && firstParsed.total && allProducts.length < firstParsed.total && firstParsed.items.length >= limit) {
      const total = firstParsed.total;
      const maxPages = 1000;
      
      while (allProducts.length < total && page < maxPages) {
        page += 1;
        const response = await this.backendApiService.get<any>(
          `/products?page=${page}&limit=${limit}`,
        );
        const parsed = this.parseProductsResponse(response);

        if (parsed.isArray) {
          allProducts = [...allProducts, ...parsed.items];
          break;
        }

        if (!parsed.items.length) {
          break;
        }

        allProducts.push(...parsed.items);

        if (!parsed.total && parsed.items.length < limit) {
          break;
        }
      }
    }

    // Récupérer les détails complets pour chaque produit (avec links)
    const productsWithDetails: ProductDto[] = [];
    
    for (const product of allProducts) {
      try {
        const detailedProduct = await this.fetchProductDetails(product._id);
        productsWithDetails.push(detailedProduct);
      } catch (error) {
        // Continue sans ce produit plutôt que de tout arrêter
      }
    }
    
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

    return links.find((link) => {
      const type = this.normalize(link.type);
      const label = this.normalize(link.label);
      return normalizedCandidates.has(type) || normalizedCandidates.has(label);
    });
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
