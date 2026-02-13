import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';
import { UrlMappingConfigDto } from './dto/url-mapping.dto';
import { InternalServerErrorException } from '@nestjs/common';

describe('ConfigController', () => {
  let controller: ConfigController;
  let service: ConfigService;

  const mockConfigService = {
    getUrlMappingConfig: jest.fn(),
  };

  const mockUrlMappingConfig: UrlMappingConfigDto = {
    timeout: 5000,
    notifications: {
      messages: ['Hello! Ressources du devhub'],
      interval: { min: 10000, max: 30000 },
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
      onboarding: null,
      help: 'https://example.com',
      team: 'https://example.com',
    },
    mappings: {
      'app.example.com': {
        news: 'https://devhub.adeo.cloud/product-overview/product-1',
        onboarding: undefined,
        help: 'https://help.example.com',
        team: 'https://team.example.com',
      },
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [ConfigController],
      providers: [{ provide: ConfigService, useValue: mockConfigService }],
    }).compile();

    controller = module.get<ConfigController>(ConfigController);
    service = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUrlMapping', () => {
    it('should return URL mapping configuration', async () => {
      mockConfigService.getUrlMappingConfig.mockResolvedValue(mockUrlMappingConfig);

      const result = await controller.getUrlMapping();

      expect(result).toEqual(mockUrlMappingConfig);
      expect(service.getUrlMappingConfig).toHaveBeenCalled();
    });

    it('should include all base config properties', async () => {
      mockConfigService.getUrlMappingConfig.mockResolvedValue(mockUrlMappingConfig);

      const result = await controller.getUrlMapping();

      expect(result).toHaveProperty('timeout');
      expect(result).toHaveProperty('notifications');
      expect(result).toHaveProperty('badge');
      expect(result).toHaveProperty('analytics');
      expect(result).toHaveProperty('defaults');
      expect(result).toHaveProperty('mappings');
    });

    it('should include hostname-based mappings', async () => {
      mockConfigService.getUrlMappingConfig.mockResolvedValue(mockUrlMappingConfig);

      const result = await controller.getUrlMapping();

      expect(result.mappings['app.example.com']).toBeDefined();
      expect(result.mappings['app.example.com']).toHaveProperty('news');
      expect(result.mappings['app.example.com']).toHaveProperty('help');
      expect(result.mappings['app.example.com']).toHaveProperty('team');
    });

    it('should propagate InternalServerErrorException from service', async () => {
      mockConfigService.getUrlMappingConfig.mockRejectedValue(
        new InternalServerErrorException('Failed to build configuration'),
      );

      await expect(controller.getUrlMapping()).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(controller.getUrlMapping()).rejects.toThrow(
        'Failed to build configuration',
      );
    });

    it('should call service method exactly once', async () => {
      mockConfigService.getUrlMappingConfig.mockResolvedValue(mockUrlMappingConfig);

      await controller.getUrlMapping();

      expect(service.getUrlMappingConfig).toHaveBeenCalledTimes(1);
    });

    it('should handle empty mappings', async () => {
      const emptyMappingsConfig = {
        ...mockUrlMappingConfig,
        mappings: {},
      };
      mockConfigService.getUrlMappingConfig.mockResolvedValue(emptyMappingsConfig);

      const result = await controller.getUrlMapping();

      expect(result.mappings).toEqual({});
      expect(Object.keys(result.mappings).length).toBe(0);
    });

    it('should propagate any errors from service', async () => {
      const error = new Error('Unexpected error');
      mockConfigService.getUrlMappingConfig.mockRejectedValue(error);

      await expect(controller.getUrlMapping()).rejects.toThrow('Unexpected error');
    });
  });
});
