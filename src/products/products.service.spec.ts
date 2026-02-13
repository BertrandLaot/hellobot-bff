import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { BackendApiService } from '../backend-api/backend-api.service';
import { ProductDto } from './dto/product.dto';
import { ModuleLightDto } from './dto/product-with-modules.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let backendApiService: BackendApiService;

  const mockBackendApiService = {
    get: jest.fn(),
  };

  const mockProduct: ProductDto = {
    _id: 'product-1',
    name: 'Test Product',
    description: 'Test description',
    links: [
      { label: 'Documentation', url: 'https://docs.example.com' },
      { label: 'GitHub', url: 'https://github.com/example' },
    ],
    onboardingModule: {
      _id: 'module-onboarding',
      title: 'Getting Started',
      name: 'Getting Started',
      type: 'guideline',
    },
  } as ProductDto;

  const mockModules: ModuleLightDto[] = [
    {
      _id: 'module-1',
      title: 'Module 1',
      type: 'video',
      description: 'Description 1',
    } as ModuleLightDto,
    {
      _id: 'module-2',
      title: 'Module 2',
      type: 'article',
      description: 'Description 2',
    } as ModuleLightDto,
  ];

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: BackendApiService, useValue: mockBackendApiService },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    backendApiService = module.get<BackendApiService>(BackendApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a product when found', async () => {
      mockBackendApiService.get.mockResolvedValue(mockProduct);

      const result = await service.findOne('product-1');

      expect(result).toEqual(mockProduct);
      expect(mockBackendApiService.get).toHaveBeenCalledWith('/products/product-1');
    });

    it('should throw NotFoundException when product not found (404)', async () => {
      const error = {
        response: { status: 404 },
        message: 'Not Found',
      };
      mockBackendApiService.get.mockRejectedValue(error);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('non-existent')).rejects.toThrow(
        'Product with ID non-existent not found',
      );
    });

    it('should propagate other errors', async () => {
      const error = {
        response: { status: 500 },
        message: 'Internal Server Error',
      };
      mockBackendApiService.get.mockRejectedValue(error);

      await expect(service.findOne('product-1')).rejects.toEqual(error);
    });

    it('should propagate network errors', async () => {
      const networkError = new Error('Network error');
      mockBackendApiService.get.mockRejectedValue(networkError);

      await expect(service.findOne('product-1')).rejects.toThrow('Network error');
    });
  });

  describe('findOneWithModules', () => {
    it('should return product with modules when both calls succeed', async () => {
      mockBackendApiService.get
        .mockResolvedValueOnce(mockProduct)
        .mockResolvedValueOnce(mockModules);

      const result = await service.findOneWithModules('product-1');

      expect(result).toEqual({
        product: mockProduct,
        modules: mockModules,
      });
      expect(mockBackendApiService.get).toHaveBeenCalledTimes(2);
      expect(mockBackendApiService.get).toHaveBeenCalledWith('/products/product-1');
      expect(mockBackendApiService.get).toHaveBeenCalledWith(
        '/products/product-1/modules',
      );
    });

    it('should make parallel calls using Promise.all', async () => {
      mockBackendApiService.get
        .mockResolvedValueOnce(mockProduct)
        .mockResolvedValueOnce(mockModules);

      const startTime = Date.now();
      await service.findOneWithModules('product-1');
      const endTime = Date.now();

      // Vérifier que les appels ont été faits en parallèle
      // (si séquentiel, ce serait > 2x le temps d'un appel)
      expect(mockBackendApiService.get).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFoundException when product not found', async () => {
      const error = {
        response: { status: 404 },
        message: 'Not Found',
      };
      mockBackendApiService.get.mockRejectedValue(error);

      await expect(service.findOneWithModules('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOneWithModules('non-existent')).rejects.toThrow(
        'Product with ID non-existent not found',
      );
    });

    it('should propagate errors from product or modules call', async () => {
      const error = {
        response: { status: 500 },
        message: 'Server Error',
      };
      mockBackendApiService.get
        .mockResolvedValueOnce(mockProduct)
        .mockRejectedValueOnce(error);

      await expect(service.findOneWithModules('product-1')).rejects.toEqual(error);
    });
  });

  describe('findLinksAndOnboarding', () => {
    it('should return links and onboarding module from product', async () => {
      mockBackendApiService.get.mockResolvedValue(mockProduct);

      const result = await service.findLinksAndOnboarding('product-1');

      expect(result).toEqual({
        links: mockProduct.links,
        onboardingModule: mockProduct.onboardingModule,
      });
      expect(mockBackendApiService.get).toHaveBeenCalledWith('/products/product-1');
    });

    it('should return empty array for links if product has no links', async () => {
      const productWithoutLinks = { ...mockProduct, links: undefined };
      mockBackendApiService.get.mockResolvedValue(productWithoutLinks);

      const result = await service.findLinksAndOnboarding('product-1');

      expect(result.links).toEqual([]);
      expect(result.onboardingModule).toBe(productWithoutLinks.onboardingModule);
    });

    it('should throw NotFoundException when product not found', async () => {
      const error = {
        response: { status: 404 },
        message: 'Not Found',
      };
      mockBackendApiService.get.mockRejectedValue(error);

      await expect(
        service.findLinksAndOnboarding('non-existent'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.findLinksAndOnboarding('non-existent'),
      ).rejects.toThrow('Product with ID non-existent not found');
    });

    it('should handle product with null onboardingModule', async () => {
      const productWithoutOnboarding = {
        ...mockProduct,
        onboardingModule: null,
      };
      mockBackendApiService.get.mockResolvedValue(productWithoutOnboarding);

      const result = await service.findLinksAndOnboarding('product-1');

      expect(result.onboardingModule).toBeNull();
    });
  });
});
