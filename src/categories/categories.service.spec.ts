import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { BackendApiService } from '../backend-api/backend-api.service';
import { CategoryResponseDto } from './dto/category-response.dto';
import { BeginnerCategoryResponseDto } from './dto/beginner-category-response.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let backendApiService: BackendApiService;

  const mockBackendApiService = {
    get: jest.fn(),
  };

  const mockCategories: CategoryResponseDto[] = [
    {
      _id: 'cat-1',
      label: 'Web Development',
    } as CategoryResponseDto,
    {
      _id: 'cat-2',
      label: 'Backend',
    } as CategoryResponseDto,
  ];

  const mockBeginnerCategories: BeginnerCategoryResponseDto[] = [
    {
      category: { _id: 'cat-1', label: 'Web Development' },
      nbModules: 10,
    } as BeginnerCategoryResponseDto,
    {
      category: { _id: 'cat-2', label: 'Backend' },
      nbModules: 5,
    } as BeginnerCategoryResponseDto,
  ];

  const mockCategory: CategoryResponseDto = {
    _id: 'cat-1',
    label: 'Web Development',
  } as CategoryResponseDto;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: BackendApiService, useValue: mockBackendApiService },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    backendApiService = module.get<BackendApiService>(BackendApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      mockBackendApiService.get.mockResolvedValue(mockCategories);

      const result = await service.getAllCategories();

      expect(result).toEqual(mockCategories);
      expect(mockBackendApiService.get).toHaveBeenCalledWith('/categories');
    });

    it('should return empty array when no categories', async () => {
      mockBackendApiService.get.mockResolvedValue([]);

      const result = await service.getAllCategories();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should propagate errors from backend API', async () => {
      const error = new Error('Backend error');
      mockBackendApiService.get.mockRejectedValue(error);

      await expect(service.getAllCategories()).rejects.toThrow('Backend error');
    });
  });

  describe('getBeginnerCategories', () => {
    it('should return beginner categories with module count', async () => {
      mockBackendApiService.get.mockResolvedValue(mockBeginnerCategories);

      const result = await service.getBeginnerCategories();

      expect(result).toEqual(mockBeginnerCategories);
      expect(mockBackendApiService.get).toHaveBeenCalledWith('/categories/beginner');
    });

    it('should verify module count is included', async () => {
      mockBackendApiService.get.mockResolvedValue(mockBeginnerCategories);

      const result = await service.getBeginnerCategories();

      expect(result[0].nbModules).toBe(10);
      expect(result[1].nbModules).toBe(5);
    });

    it('should return empty array when no beginner categories', async () => {
      mockBackendApiService.get.mockResolvedValue([]);

      const result = await service.getBeginnerCategories();

      expect(result).toEqual([]);
    });

    it('should propagate errors from backend API', async () => {
      const error = new Error('Server error');
      mockBackendApiService.get.mockRejectedValue(error);

      await expect(service.getBeginnerCategories()).rejects.toThrow('Server error');
    });
  });

  describe('getCategoryById', () => {
    it('should return category by id', async () => {
      mockBackendApiService.get.mockResolvedValue(mockCategory);

      const result = await service.getCategoryById('cat-1');

      expect(result).toEqual(mockCategory);
      expect(mockBackendApiService.get).toHaveBeenCalledWith('/categories/cat-1');
    });

    it('should call backend API with correct id', async () => {
      mockBackendApiService.get.mockResolvedValue(mockCategory);

      await service.getCategoryById('507f1f77bcf86cd799439011');

      expect(mockBackendApiService.get).toHaveBeenCalledWith(
        '/categories/507f1f77bcf86cd799439011',
      );
    });

    it('should propagate 404 errors', async () => {
      const error = {
        response: { status: 404 },
        message: 'Not Found',
      };
      mockBackendApiService.get.mockRejectedValue(error);

      await expect(service.getCategoryById('non-existent')).rejects.toEqual(error);
    });

    it('should propagate other errors', async () => {
      const error = new Error('Server error');
      mockBackendApiService.get.mockRejectedValue(error);

      await expect(service.getCategoryById('cat-1')).rejects.toThrow('Server error');
    });
  });
});
