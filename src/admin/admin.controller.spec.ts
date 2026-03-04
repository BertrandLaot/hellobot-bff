import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;

  const mockAdminService = {
    clearCache: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [{ provide: AdminService, useValue: mockAdminService }],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('clearCache', () => {
    it('should return success message', async () => {
      mockAdminService.clearCache.mockResolvedValue(undefined);

      const result = await controller.clearCache();

      expect(result).toEqual({ message: 'Cache cleared successfully' });
    });

    it('should call adminService.clearCache()', async () => {
      mockAdminService.clearCache.mockResolvedValue(undefined);

      await controller.clearCache();

      expect(service.clearCache).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from service', async () => {
      mockAdminService.clearCache.mockRejectedValue(new Error('Store error'));

      await expect(controller.clearCache()).rejects.toThrow('Store error');
    });
  });
});
