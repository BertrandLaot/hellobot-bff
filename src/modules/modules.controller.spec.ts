import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule } from '@nestjs/cache-manager';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';
import { ModuleDto } from './dto/module.dto';
import { ModuleQueryDto } from './dto/module-query.dto';
import { NotFoundException } from '@nestjs/common';

describe('ModulesController', () => {
  let controller: ModulesController;
  let service: ModulesService;

  const mockModulesService = {
    findOne: jest.fn(),
    getAllModules: jest.fn(),
    getLatestModules: jest.fn(),
    getPopularModules: jest.fn(),
    getForwardedModules: jest.fn(),
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
      imports: [CacheModule.register()],
      controllers: [ModulesController],
      providers: [{ provide: ModulesService, useValue: mockModulesService }],
    }).compile();

    controller = module.get<ModulesController>(ModulesController);
    service = module.get<ModulesService>(ModulesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a module', async () => {
      mockModulesService.findOne.mockResolvedValue(mockModule);

      const result = await controller.findOne('module-1');

      expect(result).toEqual(mockModule);
      expect(service.findOne).toHaveBeenCalledWith('module-1');
    });

    it('should propagate NotFoundException from service', async () => {
      mockModulesService.findOne.mockRejectedValue(
        new NotFoundException('Module with ID non-existent not found'),
      );

      await expect(controller.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAllModules', () => {
    it('should return paginated modules list', async () => {
      mockModulesService.getAllModules.mockResolvedValue(mockModulesList);

      const query: ModuleQueryDto = {
        page: 1,
        limit: 10,
        categories: [],
        levels: [],
        types: [],
        duration: [],
        langKeys: [],
      };

      const result = await controller.getAllModules(query);

      expect(result).toEqual(mockModulesList);
      expect(service.getAllModules).toHaveBeenCalledWith(query);
    });

    it('should pass query object with all filters to service', async () => {
      mockModulesService.getAllModules.mockResolvedValue(mockModulesList);

      const query: ModuleQueryDto = {
        page: 2,
        limit: 20,
        onlySelectedUniverse: true,
        query: 'test',
        status: 'PUBLISHED',
        categories: ['cat1'],
        levels: ['BEGINNER'],
        types: ['VIDEO'],
        duration: ['SHORT'],
        langKeys: ['fr'],
      };

      await controller.getAllModules(query);

      expect(service.getAllModules).toHaveBeenCalledWith(query);
      expect(service.getAllModules).toHaveBeenCalledTimes(1);
    });
  });

  describe('getLatestModules', () => {
    it('should return latest modules with default limit', async () => {
      const latestModules = [mockModule];
      mockModulesService.getLatestModules.mockResolvedValue(latestModules);

      const result = await controller.getLatestModules();

      expect(result).toEqual(latestModules);
      expect(service.getLatestModules).toHaveBeenCalledWith(10, undefined);
    });

    it('should return latest modules with custom limit', async () => {
      const latestModules = [mockModule];
      mockModulesService.getLatestModules.mockResolvedValue(latestModules);

      const result = await controller.getLatestModules(5);

      expect(result).toEqual(latestModules);
      expect(service.getLatestModules).toHaveBeenCalledWith(5, undefined);
    });

    it('should include universeId if provided', async () => {
      const latestModules = [mockModule];
      mockModulesService.getLatestModules.mockResolvedValue(latestModules);

      await controller.getLatestModules(15, 'universe-123');

      expect(service.getLatestModules).toHaveBeenCalledWith(15, 'universe-123');
    });
  });

  describe('getPopularModules', () => {
    it('should return popular modules without universeId', async () => {
      const popularModules = [mockModule];
      mockModulesService.getPopularModules.mockResolvedValue(popularModules);

      const result = await controller.getPopularModules();

      expect(result).toEqual(popularModules);
      expect(service.getPopularModules).toHaveBeenCalledWith(undefined);
    });

    it('should return popular modules with universeId', async () => {
      const popularModules = [mockModule];
      mockModulesService.getPopularModules.mockResolvedValue(popularModules);

      const result = await controller.getPopularModules('universe-456');

      expect(result).toEqual(popularModules);
      expect(service.getPopularModules).toHaveBeenCalledWith('universe-456');
    });
  });

  describe('getForwardedModules', () => {
    it('should return forwarded modules without universeId', async () => {
      const forwardedModules = [mockModule];
      mockModulesService.getForwardedModules.mockResolvedValue(forwardedModules);

      const result = await controller.getForwardedModules();

      expect(result).toEqual(forwardedModules);
      expect(service.getForwardedModules).toHaveBeenCalledWith(undefined);
    });

    it('should return forwarded modules with universeId', async () => {
      const forwardedModules = [mockModule];
      mockModulesService.getForwardedModules.mockResolvedValue(forwardedModules);

      const result = await controller.getForwardedModules('universe-789');

      expect(result).toEqual(forwardedModules);
      expect(service.getForwardedModules).toHaveBeenCalledWith('universe-789');
    });
  });
});
