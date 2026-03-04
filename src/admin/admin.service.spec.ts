import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;

  const mockCacheManager = {
    reset: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('clearCache', () => {
    it('should call cacheManager.reset()', async () => {
      mockCacheManager.reset.mockResolvedValue(undefined);

      await service.clearCache();

      expect(mockCacheManager.reset).toHaveBeenCalledTimes(1);
    });

    it('should resolve without returning a value', async () => {
      mockCacheManager.reset.mockResolvedValue(undefined);

      const result = await service.clearCache();

      expect(result).toBeUndefined();
    });

    it('should propagate errors from cacheManager.reset()', async () => {
      mockCacheManager.reset.mockRejectedValue(new Error('Store unavailable'));

      await expect(service.clearCache()).rejects.toThrow('Store unavailable');
    });
  });
});
