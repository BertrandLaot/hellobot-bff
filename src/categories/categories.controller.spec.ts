import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule } from '@nestjs/cache-manager';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoryResponseDto } from './dto/category-response.dto';
import { BeginnerCategoryResponseDto } from './dto/beginner-category-response.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategoriesService = {
    getAllCategories: jest.fn(),
    getBeginnerCategories: jest.fn(),
    getCategoryById: jest.fn(),
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
  ];

  const mockCategory: CategoryResponseDto = {
    _id: 'cat-1',
    label: 'Web Development',
  } as CategoryResponseDto;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [CategoriesController],
      providers: [{ provide: CategoriesService, useValue: mockCategoriesService }],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      mockCategoriesService.getAllCategories.mockResolvedValue(mockCategories);

      const result = await controller.getAllCategories();

      expect(result).toEqual(mockCategories);
      expect(service.getAllCategories).toHaveBeenCalled();
    });

    it('should return empty array when no categories', async () => {
      mockCategoriesService.getAllCategories.mockResolvedValue([]);

      const result = await controller.getAllCategories();

      expect(result).toEqual([]);
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Service error');
      mockCategoriesService.getAllCategories.mockRejectedValue(error);

      await expect(controller.getAllCategories()).rejects.toThrow('Service error');
    });
  });

  describe('getBeginnerCategories', () => {
    it('should return beginner categories with module count', async () => {
      mockCategoriesService.getBeginnerCategories.mockResolvedValue(
        mockBeginnerCategories,
      );

      const result = await controller.getBeginnerCategories();

      expect(result).toEqual(mockBeginnerCategories);
      expect(service.getBeginnerCategories).toHaveBeenCalled();
    });

    it('should include moduleCount in response', async () => {
      mockCategoriesService.getBeginnerCategories.mockResolvedValue(
        mockBeginnerCategories,
      );

      const result = await controller.getBeginnerCategories();

      expect(result[0].nbModules).toBeDefined();
      expect(result[0].nbModules).toBe(10);
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Service error');
      mockCategoriesService.getBeginnerCategories.mockRejectedValue(error);

      await expect(controller.getBeginnerCategories()).rejects.toThrow(
        'Service error',
      );
    });
  });

  describe('getCategoryById', () => {
    it('should return category by id', async () => {
      mockCategoriesService.getCategoryById.mockResolvedValue(mockCategory);

      const result = await controller.getCategoryById('cat-1');

      expect(result).toEqual(mockCategory);
      expect(service.getCategoryById).toHaveBeenCalledWith('cat-1');
    });

    it('should call service with correct id parameter', async () => {
      mockCategoriesService.getCategoryById.mockResolvedValue(mockCategory);

      await controller.getCategoryById('507f1f77bcf86cd799439011');

      expect(service.getCategoryById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
      expect(service.getCategoryById).toHaveBeenCalledTimes(1);
    });

    it('should propagate 404 errors from service', async () => {
      const error = {
        response: { status: 404 },
        message: 'Category not found',
      };
      mockCategoriesService.getCategoryById.mockRejectedValue(error);

      await expect(controller.getCategoryById('non-existent')).rejects.toEqual(
        error,
      );
    });

    it('should propagate other errors from service', async () => {
      const error = new Error('Service error');
      mockCategoriesService.getCategoryById.mockRejectedValue(error);

      await expect(controller.getCategoryById('cat-1')).rejects.toThrow(
        'Service error',
      );
    });
  });
});
