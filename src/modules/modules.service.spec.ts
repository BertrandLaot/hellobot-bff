import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { BackendApiService } from '../backend-api/backend-api.service';
import { ModuleDto } from './dto/module.dto';
import { ModuleQueryDto } from './dto/module-query.dto';

describe('ModulesService', () => {
  let service: ModulesService;
  let backendApiService: BackendApiService;

  const mockBackendApiService = {
    get: jest.fn(),
  };

  const mockModule: ModuleDto = {
    _id: 'module-1',
    title: 'Test Module',
    description: 'Test description',
  } as ModuleDto;

  const mockModulesList = {
    data: [mockModule],
    total: 1,
    page: 1,
    limit: 10,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModulesService,
        { provide: BackendApiService, useValue: mockBackendApiService },
      ],
    }).compile();

    service = module.get<ModulesService>(ModulesService);
    backendApiService = module.get<BackendApiService>(BackendApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a module when found', async () => {
      mockBackendApiService.get.mockResolvedValue(mockModule);

      const result = await service.findOne('module-1');

      expect(result).toEqual(mockModule);
      expect(mockBackendApiService.get).toHaveBeenCalledWith('/modules/module-1');
    });

    it('should throw NotFoundException when module not found (404)', async () => {
      const error = {
        response: { status: 404 },
        message: 'Not Found',
      };
      mockBackendApiService.get.mockRejectedValue(error);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('non-existent')).rejects.toThrow(
        'Module with ID non-existent not found',
      );
    });

    it('should propagate other errors', async () => {
      const error = {
        response: { status: 500 },
        message: 'Internal Server Error',
      };
      mockBackendApiService.get.mockRejectedValue(error);

      await expect(service.findOne('module-1')).rejects.toEqual(error);
    });
  });

  describe('getAllModules', () => {
    it('should construct query params correctly with all filters', async () => {
      mockBackendApiService.get.mockResolvedValue(mockModulesList);

      const query: ModuleQueryDto = {
        page: 2,
        limit: 20,
        onlySelectedUniverse: true,
        query: 'test search',
        status: 'PUBLISHED',
        allStatuses: false,
        noPlaylists: true,
        owner: 'john.doe',
        mostViewed: true,
        lastUpdated: false,
        lastReviewDate: true,
        sortBy: 'title',
        sortOrder: 'desc',
        product: 'product-1',
        type: 'VIDEO',
        level: 'BEGINNER',
        categories: ['cat1', 'cat2'],
        levels: ['BEGINNER', 'INTERMEDIATE'],
        types: ['VIDEO', 'ARTICLE'],
        duration: ['SHORT', 'MEDIUM'],
        langKeys: ['fr', 'en'],
      };

      await service.getAllModules(query);

      const callArg = mockBackendApiService.get.mock.calls[0][0];
      expect(callArg).toContain('page=2');
      expect(callArg).toContain('limit=20');
      expect(callArg).toContain('onlySelectedUniverse=true');
      expect(callArg).toContain('query=test+search');
      expect(callArg).toContain('status=PUBLISHED');
      expect(callArg).toContain('allStatuses=false');
      expect(callArg).toContain('noPlaylists=true');
      expect(callArg).toContain('owner=john.doe');
      expect(callArg).toContain('mostViewed=true');
      expect(callArg).toContain('lastUpdated=false');
      expect(callArg).toContain('lastReviewDate=true');
      expect(callArg).toContain('sortBy=title');
      expect(callArg).toContain('sortOrder=desc');
      expect(callArg).toContain('product=product-1');
      expect(callArg).toContain('type=VIDEO');
      expect(callArg).toContain('level=BEGINNER');
      expect(callArg).toContain('categories%5B%5D=cat1');
      expect(callArg).toContain('categories%5B%5D=cat2');
      expect(callArg).toContain('levels%5B%5D=BEGINNER');
      expect(callArg).toContain('levels%5B%5D=INTERMEDIATE');
      expect(callArg).toContain('types%5B%5D=VIDEO');
      expect(callArg).toContain('types%5B%5D=ARTICLE');
      expect(callArg).toContain('duration%5B%5D=SHORT');
      expect(callArg).toContain('duration%5B%5D=MEDIUM');
      expect(callArg).toContain('langKeys%5B%5D=fr');
      expect(callArg).toContain('langKeys%5B%5D=en');
    });

    it('should construct query params with minimal filters', async () => {
      mockBackendApiService.get.mockResolvedValue(mockModulesList);

      const query: ModuleQueryDto = {
        page: 1,
        limit: 10,
        categories: [],
        levels: [],
        types: [],
        duration: [],
        langKeys: [],
      };

      await service.getAllModules(query);

      const callArg = mockBackendApiService.get.mock.calls[0][0];
      expect(callArg).toContain('page=1');
      expect(callArg).toContain('limit=10');
      expect(callArg).not.toContain('onlySelectedUniverse');
      expect(callArg).not.toContain('query=');
      expect(callArg).not.toContain('status=');
    });

    it('should return modules list from backend', async () => {
      mockBackendApiService.get.mockResolvedValue(mockModulesList);

      const query: ModuleQueryDto = {
        page: 1,
        limit: 10,
        categories: [],
        levels: [],
        types: [],
        duration: [],
        langKeys: [],
      };

      const result = await service.getAllModules(query);

      expect(result).toEqual(mockModulesList);
    });

    it('should handle empty arrays in query params', async () => {
      mockBackendApiService.get.mockResolvedValue(mockModulesList);

      const query: ModuleQueryDto = {
        page: 1,
        limit: 10,
        categories: [],
        levels: [],
        types: [],
        duration: [],
        langKeys: [],
      };

      await service.getAllModules(query);

      const callArg = mockBackendApiService.get.mock.calls[0][0];
      expect(callArg).not.toContain('categories[]');
      expect(callArg).not.toContain('levels[]');
      expect(callArg).not.toContain('types[]');
    });
  });

  describe('getLatestModules', () => {
    it('should fetch latest modules with limit', async () => {
      const latestModules = [mockModule];
      mockBackendApiService.get.mockResolvedValue(latestModules);

      const result = await service.getLatestModules(10);

      expect(result).toEqual(latestModules);
      expect(mockBackendApiService.get).toHaveBeenCalledWith(
        '/modules/latest?limit=10',
      );
    });

    it('should include universeId if provided', async () => {
      const latestModules = [mockModule];
      mockBackendApiService.get.mockResolvedValue(latestModules);

      await service.getLatestModules(5, 'universe-123');

      expect(mockBackendApiService.get).toHaveBeenCalledWith(
        '/modules/latest?limit=5&universeId=universe-123',
      );
    });

    it('should not include universeId if not provided', async () => {
      mockBackendApiService.get.mockResolvedValue([]);

      await service.getLatestModules(10);

      const callArg = mockBackendApiService.get.mock.calls[0][0];
      expect(callArg).not.toContain('universeId');
    });
  });

  describe('getPopularModules', () => {
    it('should fetch popular modules without universeId', async () => {
      const popularModules = [mockModule];
      mockBackendApiService.get.mockResolvedValue(popularModules);

      const result = await service.getPopularModules();

      expect(result).toEqual(popularModules);
      expect(mockBackendApiService.get).toHaveBeenCalledWith('/modules/popular?');
    });

    it('should include universeId if provided', async () => {
      const popularModules = [mockModule];
      mockBackendApiService.get.mockResolvedValue(popularModules);

      await service.getPopularModules('universe-456');

      expect(mockBackendApiService.get).toHaveBeenCalledWith(
        '/modules/popular?universeId=universe-456',
      );
    });
  });

  describe('getForwardedModules', () => {
    it('should fetch forwarded modules without universeId', async () => {
      const forwardedModules = [mockModule];
      mockBackendApiService.get.mockResolvedValue(forwardedModules);

      const result = await service.getForwardedModules();

      expect(result).toEqual(forwardedModules);
      expect(mockBackendApiService.get).toHaveBeenCalledWith('/modules/forwarded?');
    });

    it('should include universeId if provided', async () => {
      const forwardedModules = [mockModule];
      mockBackendApiService.get.mockResolvedValue(forwardedModules);

      await service.getForwardedModules('universe-789');

      expect(mockBackendApiService.get).toHaveBeenCalledWith(
        '/modules/forwarded?universeId=universe-789',
      );
    });
  });
});
