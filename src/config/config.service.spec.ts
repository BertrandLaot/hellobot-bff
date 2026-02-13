import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from './config.service';
import { BackendApiService } from '../backend-api/backend-api.service';
import { ProductsService } from '../products/products.service';
import { ProductDto } from '../products/dto/product.dto';

describe('ConfigService', () => {
  let service: ConfigService;
  let backendApiService: BackendApiService;
  let productsService: ProductsService;

  const mockBackendApiService = {
    get: jest.fn(),
  };

  const mockProductsService = {
    findOne: jest.fn(),
  };

  const mockProducts: ProductDto[] = [
    {
      _id: 'product-1',
      name: 'Product 1',
      links: [
        { type: 'app_url', label: 'Application', url: 'https://app1.example.com' },
        { type: 'support', label: 'Help', url: 'https://help.example.com' },
        { type: 'team', label: 'Team', url: 'https://team.example.com' },
      ],
      onboardingModule: null,
    } as ProductDto,
    {
      _id: 'product-2',
      name: 'Product 2',
      links: [
        { type: 'website', label: 'Site', url: 'https://app2.example.com' },
      ],
      onboardingModule: {
        _id: 'onboarding-module-1',
        title: 'Getting Started',
        name: 'Getting Started',
        type: 'guideline',
      },
    } as ProductDto,
  ];

  const mockProductDetail: ProductDto = {
    _id: 'product-1',
    name: 'Product 1',
    links: [
      { type: 'app_url', label: 'Application', url: 'https://app1.example.com' },
      { type: 'support', label: 'Help', url: 'https://help.example.com' },
      { type: 'team', label: 'Team', url: 'https://team.example.com' },
    ],
    onboardingModule: null,
  } as ProductDto;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        { provide: BackendApiService, useValue: mockBackendApiService },
        { provide: ProductsService, useValue: mockProductsService },
      ],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
    backendApiService = module.get<BackendApiService>(BackendApiService);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUrlMappingConfig', () => {
    it('should return url mapping config with products mappings', async () => {
      const productsResponse = {
        items: [mockProducts[0]],
        total: 1,
      };

      mockBackendApiService.get.mockResolvedValue(productsResponse);
      mockProductsService.findOne.mockResolvedValue(mockProductDetail);

      const result = await service.getUrlMappingConfig();

      expect(result).toHaveProperty('timeout');
      expect(result).toHaveProperty('notifications');
      expect(result).toHaveProperty('badge');
      expect(result).toHaveProperty('analytics');
      expect(result).toHaveProperty('defaults');
      expect(result).toHaveProperty('mappings');
      expect(result.timeout).toBe(5000);
    });

    it('should create hostname-based mappings', async () => {
      const productsResponse = {
        items: [mockProducts[0]],
        total: 1,
      };

      mockBackendApiService.get.mockResolvedValue(productsResponse);
      mockProductsService.findOne.mockResolvedValue(mockProductDetail);

      const result = await service.getUrlMappingConfig();

      expect(result.mappings['app1.example.com']).toBeDefined();
      expect(result.mappings['app1.example.com']).toEqual({
        news: 'https://devhub.adeo.cloud/product-overview/product-1',
        onboarding: undefined,
        help: 'https://help.example.com',
        team: 'https://team.example.com',
      });
    });

    it('should handle pagination with multiple pages', async () => {
      const firstPage = {
        items: Array(100).fill(mockProducts[0]),
        total: 150,
      };
      const secondPage = {
        items: Array(50).fill(mockProducts[0]),
        total: 150,
      };

      mockBackendApiService.get
        .mockResolvedValueOnce(firstPage)
        .mockResolvedValueOnce(secondPage);
      
      mockProductsService.findOne.mockResolvedValue(mockProductDetail);

      await service.getUrlMappingConfig();

      expect(mockBackendApiService.get).toHaveBeenCalledWith('/products?page=1&limit=100');
      expect(mockBackendApiService.get).toHaveBeenCalledWith('/products?page=2&limit=100');
    });

    it('should handle products response as array', async () => {
      mockBackendApiService.get.mockResolvedValue([mockProducts[0]]);
      mockProductsService.findOne.mockResolvedValue(mockProductDetail);

      const result = await service.getUrlMappingConfig();

      expect(result.mappings['app1.example.com']).toBeDefined();
    });

    it('should skip products without valid app URL', async () => {
      const productWithoutAppUrl = {
        ...mockProducts[0],
        links: [
          { type: 'documentation', label: 'Docs', url: 'https://docs.example.com' },
        ],
      };

      mockBackendApiService.get.mockResolvedValue({
        items: [productWithoutAppUrl],
        total: 1,
      });
      mockProductsService.findOne.mockResolvedValue(productWithoutAppUrl as ProductDto);

      const result = await service.getUrlMappingConfig();

      expect(Object.keys(result.mappings).length).toBe(0);
    });

    it('should use defaults when links are missing', async () => {
      const productWithoutOptionalLinks = {
        _id: 'product-minimal',
        name: 'Minimal Product',
        links: [
          { type: 'app_url', label: 'App', url: 'https://minimal.example.com' },
        ],
        onboardingModule: null,
      } as ProductDto;

      mockBackendApiService.get.mockResolvedValue({
        items: [productWithoutOptionalLinks],
        total: 1,
      });
      mockProductsService.findOne.mockResolvedValue(productWithoutOptionalLinks);

      const result = await service.getUrlMappingConfig();

      expect(result.mappings['minimal.example.com']).toEqual({
        news: 'https://devhub.adeo.cloud/product-overview/product-minimal',
        onboarding: undefined,
        help: 'https://example.com',
        team: 'https://example.com',
      });
    });

    it('should handle onboarding module retrieval', async () => {
      const productWithOnboarding = mockProducts[1];
      const modules = [
        {
          _id: 'onboarding-module-1',
          title: 'Getting Started',
          image: 'https://example.com/image.png',
          description: 'Start here',
        },
      ];

      mockBackendApiService.get
        .mockResolvedValueOnce({ items: [productWithOnboarding], total: 1 })
        .mockResolvedValueOnce(modules);
      
      mockProductsService.findOne.mockResolvedValue(productWithOnboarding);

      const result = await service.getUrlMappingConfig();

      expect(result.mappings['app2.example.com'].onboarding).toEqual({
        _id: 'onboarding-module-1',
        name: 'Getting Started',
        image: 'https://example.com/image.png',
        description: 'Start here',
      });
    });

    it('should ignore errors when fetching onboarding modules', async () => {
      const productWithOnboarding = mockProducts[1];

      mockBackendApiService.get
        .mockResolvedValueOnce({ items: [productWithOnboarding], total: 1 })
        .mockRejectedValueOnce(new Error('Failed to fetch modules'));
      
      mockProductsService.findOne.mockResolvedValue(productWithOnboarding);

      const result = await service.getUrlMappingConfig();

      expect(result.mappings['app2.example.com'].onboarding).toBeUndefined();
    });

    it('should continue processing when individual product fetch fails', async () => {
      mockBackendApiService.get.mockResolvedValue({
        items: [mockProducts[0], mockProducts[1]],
        total: 2,
      });

      mockProductsService.findOne
        .mockRejectedValueOnce(new Error('Product not found'))
        .mockResolvedValueOnce(mockProducts[1]);

      const result = await service.getUrlMappingConfig();

      // Seul le deuxième produit doit être dans les mappings
      expect(result.mappings['app2.example.com']).toBeDefined();
      expect(result.mappings['app1.example.com']).toBeUndefined();
    });

    it('should throw InternalServerErrorException on critical errors', async () => {
      mockBackendApiService.get.mockRejectedValue(new Error('Backend unavailable'));

      await expect(service.getUrlMappingConfig()).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.getUrlMappingConfig()).rejects.toThrow(
        'Failed to build URL mapping configuration: Backend unavailable',
      );
    });

    it('should find app URL with various type/label variations', async () => {
      const productVariations = {
        _id: 'product-var',
        name: 'Product Variations',
        links: [
          { type: 'website', label: 'Site', url: 'https://var.example.com' },
        ],
        onboardingModule: null,
      } as ProductDto;

      mockBackendApiService.get.mockResolvedValue({
        items: [productVariations],
        total: 1,
      });
      mockProductsService.findOne.mockResolvedValue(productVariations);

      const result = await service.getUrlMappingConfig();

      expect(result.mappings['var.example.com']).toBeDefined();
    });

    it('should normalize link types and labels for matching', async () => {
      const productCaseSensitive = {
        _id: 'product-case',
        name: 'Case Sensitive',
        links: [
          { type: 'APP_URL', label: 'Application', url: 'https://case.example.com' },
          { type: 'SUPPORT', label: 'HELP', url: 'https://help-case.example.com' },
        ],
        onboardingModule: null,
      } as ProductDto;

      mockBackendApiService.get.mockResolvedValue({
        items: [productCaseSensitive],
        total: 1,
      });
      mockProductsService.findOne.mockResolvedValue(productCaseSensitive);

      const result = await service.getUrlMappingConfig();

      expect(result.mappings['case.example.com']).toBeDefined();
      expect(result.mappings['case.example.com'].help).toBe('https://help-case.example.com');
    });

    it('should handle invalid URLs gracefully', async () => {
      const productInvalidUrl = {
        _id: 'product-invalid',
        name: 'Invalid URL',
        links: [
          { type: 'app_url', label: 'App', url: 'not-a-valid-url' },
        ],
        onboardingModule: null,
      } as ProductDto;

      mockBackendApiService.get.mockResolvedValue({
        items: [productInvalidUrl],
        total: 1,
      });
      mockProductsService.findOne.mockResolvedValue(productInvalidUrl);

      const result = await service.getUrlMappingConfig();

      expect(Object.keys(result.mappings).length).toBe(0);
    });
  });
});
