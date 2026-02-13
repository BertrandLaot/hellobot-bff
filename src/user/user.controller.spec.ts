import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule } from '@nestjs/cache-manager';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { ModuleLightDto } from './dto/module-light.dto';
import { WatchLaterDto } from './dto/watch-later.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    getUserInformations: jest.fn(),
    getWatchLaterModules: jest.fn(),
    addWatchLaterModule: jest.fn(),
    removeWatchLaterModule: jest.fn(),
  };

  const mockUser: Partial<UserDto> = {
    id: '123456',
    title: 'Developer',
    preferredLanguage: 'fr',
  };

  const mockModules: ModuleLightDto[] = [
    { _id: 'module-1', title: 'Module 1', type: 'video' } as ModuleLightDto,
    { _id: 'module-2', title: 'Module 2', type: 'article' } as ModuleLightDto,
  ];

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserInformations', () => {
    it('should return user information', async () => {
      mockUserService.getUserInformations.mockResolvedValue(mockUser);

      const result = await controller.getUserInformations(123456);

      expect(result).toEqual(mockUser);
      expect(service.getUserInformations).toHaveBeenCalledWith(123456);
    });

    it('should parse ldap as integer using ParseIntPipe', async () => {
      mockUserService.getUserInformations.mockResolvedValue(mockUser);

      await controller.getUserInformations(789012);

      expect(service.getUserInformations).toHaveBeenCalledWith(789012);
      expect(typeof 789012).toBe('number');
    });

    it('should propagate errors from service', async () => {
      const error = new Error('User not found');
      mockUserService.getUserInformations.mockRejectedValue(error);

      await expect(controller.getUserInformations(999999)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('getWatchLaterModules', () => {
    it('should return watch later modules list', async () => {
      mockUserService.getWatchLaterModules.mockResolvedValue(mockModules);

      const result = await controller.getWatchLaterModules('123456');

      expect(result).toEqual(mockModules);
      expect(service.getWatchLaterModules).toHaveBeenCalledWith('123456');
    });

    it('should handle string ldap parameter', async () => {
      mockUserService.getWatchLaterModules.mockResolvedValue(mockModules);

      await controller.getWatchLaterModules('abc123');

      expect(service.getWatchLaterModules).toHaveBeenCalledWith('abc123');
    });

    it('should return empty array when no modules in watch later', async () => {
      mockUserService.getWatchLaterModules.mockResolvedValue([]);

      const result = await controller.getWatchLaterModules('123456');

      expect(result).toEqual([]);
    });
  });

  describe('addWatchLaterModule', () => {
    it('should add module to watch later list', async () => {
      const watchLaterDto: WatchLaterDto = { moduleId: 'module-3' };
      const updatedList = [...mockModules, { _id: 'module-3', title: 'Module 3', type: 'video' }] as ModuleLightDto[];
      mockUserService.addWatchLaterModule.mockResolvedValue(updatedList);

      const result = await controller.addWatchLaterModule('123456', watchLaterDto);

      expect(result).toEqual(updatedList);
      expect(service.addWatchLaterModule).toHaveBeenCalledWith(
        '123456',
        watchLaterDto,
      );
    });

    it('should pass correct parameters to service', async () => {
      const watchLaterDto: WatchLaterDto = { moduleId: 'new-module' };
      mockUserService.addWatchLaterModule.mockResolvedValue(mockModules);

      await controller.addWatchLaterModule('789012', watchLaterDto);

      expect(service.addWatchLaterModule).toHaveBeenCalledWith(
        '789012',
        watchLaterDto,
      );
      expect(service.addWatchLaterModule).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from service', async () => {
      const watchLaterDto: WatchLaterDto = { moduleId: 'module-1' };
      const error = new Error('Module already exists');
      mockUserService.addWatchLaterModule.mockRejectedValue(error);

      await expect(
        controller.addWatchLaterModule('123456', watchLaterDto),
      ).rejects.toThrow('Module already exists');
    });
  });

  describe('removeWatchLaterModule', () => {
    it('should remove module from watch later list', async () => {
      const updatedList = [mockModules[1]];
      mockUserService.removeWatchLaterModule.mockResolvedValue(updatedList);

      const result = await controller.removeWatchLaterModule('123456', 'module-1');

      expect(result).toEqual(updatedList);
      expect(service.removeWatchLaterModule).toHaveBeenCalledWith(
        '123456',
        'module-1',
      );
    });

    it('should pass correct parameters to service', async () => {
      mockUserService.removeWatchLaterModule.mockResolvedValue([]);

      await controller.removeWatchLaterModule('789012', 'module-to-remove');

      expect(service.removeWatchLaterModule).toHaveBeenCalledWith(
        '789012',
        'module-to-remove',
      );
    });

    it('should handle both ldap and moduleId as strings', async () => {
      mockUserService.removeWatchLaterModule.mockResolvedValue([]);

      await controller.removeWatchLaterModule('user-ldap', 'module-id');

      expect(service.removeWatchLaterModule).toHaveBeenCalledWith(
        'user-ldap',
        'module-id',
      );
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Module not found');
      mockUserService.removeWatchLaterModule.mockRejectedValue(error);

      await expect(
        controller.removeWatchLaterModule('123456', 'non-existent'),
      ).rejects.toThrow('Module not found');
    });
  });
});
