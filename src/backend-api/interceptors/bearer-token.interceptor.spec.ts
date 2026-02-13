import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BearerTokenInterceptor } from './bearer-token.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('BearerTokenInterceptor', () => {
  let interceptor: BearerTokenInterceptor;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  const createMockExecutionContext = (headers: any = {}): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers,
        }),
      }),
    } as ExecutionContext;
  };

  const mockCallHandler: CallHandler = {
    handle: jest.fn(() => of('test response')),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BearerTokenInterceptor,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    interceptor = module.get<BearerTokenInterceptor>(BearerTokenInterceptor);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should inject Authorization header with bearer token', (done) => {
    const bearerToken = 'test-bearer-token';
    mockConfigService.get.mockReturnValue(bearerToken);

    const headers = {};
    const context = createMockExecutionContext(headers);

    interceptor.intercept(context, mockCallHandler).subscribe({
      next: (value) => {
        expect(headers['Authorization']).toBe(`Bearer ${bearerToken}`);
        expect(value).toBe('test response');
        expect(mockCallHandler.handle).toHaveBeenCalled();
        done();
      },
    });
  });

  it('should not add Authorization header if token is not defined', (done) => {
    mockConfigService.get.mockReturnValue(undefined);

    const headers = {};
    const context = createMockExecutionContext(headers);

    interceptor.intercept(context, mockCallHandler).subscribe({
      next: () => {
        expect(headers['Authorization']).toBeUndefined();
        expect(mockCallHandler.handle).toHaveBeenCalled();
        done();
      },
    });
  });

  it('should not fail if headers object is missing', (done) => {
    mockConfigService.get.mockReturnValue('test-token');

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as ExecutionContext;

    interceptor.intercept(context, mockCallHandler).subscribe({
      next: () => {
        expect(mockCallHandler.handle).toHaveBeenCalled();
        done();
      },
    });
  });

  it('should override existing Authorization header', (done) => {
    const newToken = 'new-bearer-token';
    mockConfigService.get.mockReturnValue(newToken);

    const headers = { Authorization: 'Bearer old-token' };
    const context = createMockExecutionContext(headers);

    interceptor.intercept(context, mockCallHandler).subscribe({
      next: () => {
        expect(headers['Authorization']).toBe(`Bearer ${newToken}`);
        done();
      },
    });
  });

  it('should call ConfigService.get with correct parameter', (done) => {
    mockConfigService.get.mockReturnValue('token');

    const context = createMockExecutionContext({});

    interceptor.intercept(context, mockCallHandler).subscribe({
      next: () => {
        expect(mockConfigService.get).toHaveBeenCalledWith('BACKEND_BEARER_TOKEN');
        done();
      },
    });
  });
});
