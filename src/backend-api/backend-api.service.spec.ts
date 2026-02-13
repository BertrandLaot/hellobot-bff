import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { BackendApiService } from './backend-api.service';
import { of, throwError } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';

describe('BackendApiService', () => {
  let service: BackendApiService;
  let httpService: HttpService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        BACKEND_API_URL: 'http://localhost:8080/api',
        BACKEND_BEARER_TOKEN: 'test-token',
        DEVPORTAL_API_KEY: 'test-api-key',
      };
      return config[key];
    }),
  };

  const mockHttpService = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BackendApiService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<BackendApiService>(BackendApiService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('constructor', () => {
    it('should throw error if BACKEND_API_URL is missing', () => {
      const badConfigService = {
        get: jest.fn((key: string) => {
          if (key === 'BACKEND_API_URL') return undefined;
          if (key === 'BACKEND_BEARER_TOKEN') return 'test-token';
          if (key === 'DEVPORTAL_API_KEY') return 'test-api-key';
        }),
      };

      expect(() => {
        new BackendApiService(
          mockHttpService as any,
          badConfigService as any,
        );
      }).toThrow('BACKEND_API_URL is not defined in environment variables');
    });

    it('should throw error if BACKEND_BEARER_TOKEN is missing', () => {
      const badConfigService = {
        get: jest.fn((key: string) => {
          if (key === 'BACKEND_API_URL') return 'http://localhost:8080/api';
          if (key === 'BACKEND_BEARER_TOKEN') return undefined;
          if (key === 'DEVPORTAL_API_KEY') return 'test-api-key';
        }),
      };

      expect(() => {
        new BackendApiService(
          mockHttpService as any,
          badConfigService as any,
        );
      }).toThrow('BACKEND_BEARER_TOKEN is not defined in environment variables');
    });

    it('should throw error if DEVPORTAL_API_KEY is missing', () => {
      const badConfigService = {
        get: jest.fn((key: string) => {
          if (key === 'BACKEND_API_URL') return 'http://localhost:8080/api';
          if (key === 'BACKEND_BEARER_TOKEN') return 'test-token';
          if (key === 'DEVPORTAL_API_KEY') return undefined;
        }),
      };

      expect(() => {
        new BackendApiService(
          mockHttpService as any,
          badConfigService as any,
        );
      }).toThrow('DEVPORTAL_API_KEY is not defined in environment variables');
    });
  });

  describe('get', () => {
    it('should make GET request with correct URL and headers', async () => {
      const mockData = { id: 1, name: 'Test' };
      const mockResponse: AxiosResponse = {
        data: mockData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await service.get('/test-endpoint');

      expect(result).toEqual(mockData);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'http://localhost:8080/api/test-endpoint',
        {
          headers: {
            Authorization: 'Bearer test-token',
            'x-gateway-apikey': 'test-api-key',
          },
        },
      );
    });

    it('should merge custom headers with default headers', async () => {
      const mockData = { id: 1 };
      const mockResponse: AxiosResponse = {
        data: mockData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      await service.get('/test', {
        headers: { 'Custom-Header': 'custom-value' },
      });

      expect(mockHttpService.get).toHaveBeenCalledWith(
        'http://localhost:8080/api/test',
        {
          headers: {
            Authorization: 'Bearer test-token',
            'x-gateway-apikey': 'test-api-key',
            'Custom-Header': 'custom-value',
          },
        },
      );
    });

    it('should propagate errors from HTTP service', async () => {
      const error = new Error('Network error');
      mockHttpService.get.mockReturnValue(throwError(() => error));

      await expect(service.get('/test')).rejects.toThrow('Network error');
    });
  });

  describe('post', () => {
    it('should make POST request with correct URL, data and headers', async () => {
      const mockData = { id: 1, created: true };
      const postData = { name: 'New Item' };
      const mockResponse: AxiosResponse = {
        data: mockData,
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      const result = await service.post('/test-endpoint', postData);

      expect(result).toEqual(mockData);
      expect(mockHttpService.post).toHaveBeenCalledWith(
        'http://localhost:8080/api/test-endpoint',
        postData,
        {
          headers: {
            Authorization: 'Bearer test-token',
          },
        },
      );
    });

    it('should merge custom headers', async () => {
      const mockResponse: AxiosResponse = {
        data: {},
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      await service.post(
        '/test',
        { data: 'test' },
        { headers: { 'Content-Type': 'application/json' } },
      );

      expect(mockHttpService.post).toHaveBeenCalledWith(
        'http://localhost:8080/api/test',
        { data: 'test' },
        {
          headers: {
            Authorization: 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        },
      );
    });
  });

  describe('put', () => {
    it('should make PUT request with correct URL, data and headers', async () => {
      const mockData = { id: 1, updated: true };
      const putData = { name: 'Updated Item' };
      const mockResponse: AxiosResponse = {
        data: mockData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.put.mockReturnValue(of(mockResponse));

      const result = await service.put('/test-endpoint/1', putData);

      expect(result).toEqual(mockData);
      expect(mockHttpService.put).toHaveBeenCalledWith(
        'http://localhost:8080/api/test-endpoint/1',
        putData,
        {
          headers: {
            Authorization: 'Bearer test-token',
          },
        },
      );
    });
  });

  describe('patch', () => {
    it('should make PATCH request with correct URL, data and headers', async () => {
      const mockData = { id: 1, patched: true };
      const patchData = { status: 'active' };
      const mockResponse: AxiosResponse = {
        data: mockData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.patch.mockReturnValue(of(mockResponse));

      const result = await service.patch('/test-endpoint/1', patchData);

      expect(result).toEqual(mockData);
      expect(mockHttpService.patch).toHaveBeenCalledWith(
        'http://localhost:8080/api/test-endpoint/1',
        patchData,
        {
          headers: {
            Authorization: 'Bearer test-token',
          },
        },
      );
    });
  });

  describe('delete', () => {
    it('should make DELETE request with correct URL and headers', async () => {
      const mockData = { deleted: true };
      const mockResponse: AxiosResponse = {
        data: mockData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.delete.mockReturnValue(of(mockResponse));

      const result = await service.delete('/test-endpoint/1');

      expect(result).toEqual(mockData);
      expect(mockHttpService.delete).toHaveBeenCalledWith(
        'http://localhost:8080/api/test-endpoint/1',
        {
          headers: {
            Authorization: 'Bearer test-token',
          },
        },
      );
    });

    it('should merge custom config', async () => {
      const mockResponse: AxiosResponse = {
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.delete.mockReturnValue(of(mockResponse));

      await service.delete('/test/1', { params: { force: true } });

      expect(mockHttpService.delete).toHaveBeenCalledWith(
        'http://localhost:8080/api/test/1',
        {
          params: { force: true },
          headers: {
            Authorization: 'Bearer test-token',
          },
        },
      );
    });
  });
});
