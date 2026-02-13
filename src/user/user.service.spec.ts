import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { BackendApiService } from '../backend-api/backend-api.service';
import { UserDto } from './dto/user.dto';
import { ModuleLightDto } from './dto/module-light.dto';
import { WatchLaterDto } from './dto/watch-later.dto';

describe('UserService', () => {
  let service: UserService;
  let backendApiService: BackendApiService;

  const mockBackendApiService = {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  };

  const mockUser: Partial<UserDto> = {
    id: '123456',
    title: 'Developer',
    preferredLanguage: 'fr',
  };

  const mockModuleLightList: ModuleLightDto[] = [
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
        UserService,
        { provide: BackendApiService, useValue: mockBackendApiService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    backendApiService = module.get<BackendApiService>(BackendApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserInformations', () => {
    it('should return user information', async () => {
      mockBackendApiService.get.mockResolvedValue(mockUser);

      const result = await service.getUserInformations(123456);

      expect(result).toEqual(mockUser);
      expect(mockBackendApiService.get).toHaveBeenCalledWith('/user/123456');
    });

    it('should call backend API with correct ldap', async () => {
      mockBackendApiService.get.mockResolvedValue(mockUser);

      await service.getUserInformations(789012);

      expect(mockBackendApiService.get).toHaveBeenCalledWith('/user/789012');
    });

    it('should propagate errors from backend API', async () => {
      const error = new Error('User not found');
      mockBackendApiService.get.mockRejectedValue(error);

      await expect(service.getUserInformations(999999)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('getWatchLaterModules', () => {
    it('should return watch later modules list', async () => {
      mockBackendApiService.get.mockResolvedValue(mockModuleLightList);

      const result = await service.getWatchLaterModules('123456');

      expect(result).toEqual(mockModuleLightList);
      expect(mockBackendApiService.get).toHaveBeenCalledWith(
        '/user/123456/watchLater',
      );
    });

    it('should handle empty watch later list', async () => {
      mockBackendApiService.get.mockResolvedValue([]);

      const result = await service.getWatchLaterModules('123456');

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should call backend API with string ldap', async () => {
      mockBackendApiService.get.mockResolvedValue(mockModuleLightList);

      await service.getWatchLaterModules('abc123');

      expect(mockBackendApiService.get).toHaveBeenCalledWith(
        '/user/abc123/watchLater',
      );
    });
  });

  describe('addWatchLaterModule', () => {
    it('should add module to watch later list', async () => {
      const watchLaterDto: WatchLaterDto = {
        moduleId: 'module-3',
      };
      const updatedList = [...mockModuleLightList, { id: 'module-3' }] as ModuleLightDto[];
      mockBackendApiService.post.mockResolvedValue(updatedList);

      const result = await service.addWatchLaterModule('123456', watchLaterDto);

      expect(result).toEqual(updatedList);
      expect(mockBackendApiService.post).toHaveBeenCalledWith(
        '/user/123456/watchLater',
        watchLaterDto,
      );
    });

    it('should pass the correct body to backend API', async () => {
      const watchLaterDto: WatchLaterDto = {
        moduleId: 'new-module-id',
      };
      mockBackendApiService.post.mockResolvedValue(mockModuleLightList);

      await service.addWatchLaterModule('123456', watchLaterDto);

      expect(mockBackendApiService.post).toHaveBeenCalledWith(
        '/user/123456/watchLater',
        { moduleId: 'new-module-id' },
      );
    });

    it('should propagate errors from backend API', async () => {
      const error = new Error('Module already in watch later');
      const watchLaterDto: WatchLaterDto = { moduleId: 'module-1' };
      mockBackendApiService.post.mockRejectedValue(error);

      await expect(
        service.addWatchLaterModule('123456', watchLaterDto),
      ).rejects.toThrow('Module already in watch later');
    });
  });

  describe('removeWatchLaterModule', () => {
    it('should remove module from watch later list', async () => {
      const updatedList = [mockModuleLightList[1]];
      mockBackendApiService.delete.mockResolvedValue(updatedList);

      const result = await service.removeWatchLaterModule('123456', 'module-1');

      expect(result).toEqual(updatedList);
      expect(mockBackendApiService.delete).toHaveBeenCalledWith(
        '/user/123456/watchLater/module-1',
      );
    });

    it('should call backend API with correct parameters', async () => {
      mockBackendApiService.delete.mockResolvedValue([]);

      await service.removeWatchLaterModule('789012', 'module-to-remove');

      expect(mockBackendApiService.delete).toHaveBeenCalledWith(
        '/user/789012/watchLater/module-to-remove',
      );
    });

    it('should handle removing from empty list', async () => {
      mockBackendApiService.delete.mockResolvedValue([]);

      const result = await service.removeWatchLaterModule('123456', 'module-1');

      expect(result).toEqual([]);
    });

    it('should propagate errors from backend API', async () => {
      const error = new Error('Module not found in watch later');
      mockBackendApiService.delete.mockRejectedValue(error);

      await expect(
        service.removeWatchLaterModule('123456', 'non-existent'),
      ).rejects.toThrow('Module not found in watch later');
    });
  });
});
