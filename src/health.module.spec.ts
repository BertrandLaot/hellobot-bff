import { Test, TestingModule } from '@nestjs/testing';
import { HealthModule } from './health.module';

describe('HealthModule', () => {
  let healthModule: TestingModule;

  beforeEach(async () => {
    healthModule = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(healthModule).toBeDefined();
  });

  it('should have HealthController', () => {
    const controllers = Reflect.getMetadata('controllers', HealthModule);
    expect(controllers).toBeDefined();
    expect(controllers.length).toBe(1);
  });

  describe('HealthController', () => {
    let controller: any;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [HealthModule],
      }).compile();

      // Get the HealthController from the module
      const controllers = Reflect.getMetadata('controllers', HealthModule);
      const HealthController = controllers[0];
      controller = module.get(HealthController);
    });

    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    describe('GET /info', () => {
      it('should return health status information', () => {
        const result = controller.get();

        expect(result).toHaveProperty('status');
        expect(result.status).toBe('ok');
      });

      it('should return running environment info', () => {
        process.env.ENV = 'development';
        process.env.BU_CODE = 'test-bu';

        const result = controller.get();

        expect(result).toHaveProperty('running on');
        expect(result['running on']).toContain('development');
        expect(result['running on']).toContain('test-bu');
      });

      it('should return listening port from PORT env variable', () => {
        process.env.PORT = '3000';

        const result = controller.get();

        expect(result).toHaveProperty('listening on');
        expect(result['listening on']).toBe('3000');
      });

      it('should use default port 8080 if PORT is not set', () => {
        delete process.env.PORT;

        const result = controller.get();

        expect(result['listening on']).toBe(8080);
      });

      it('should return admin port from HEALTH_PORT env variable', () => {
        process.env.HEALTH_PORT = '9090';

        const result = controller.get();

        expect(result).toHaveProperty('admin on');
        expect(result['admin on']).toBe('9090');
      });

      it('should use default admin port 8081 if HEALTH_PORT is not set', () => {
        delete process.env.HEALTH_PORT;

        const result = controller.get();

        expect(result['admin on']).toBe(8081);
      });

      it('should handle undefined environment variables gracefully', () => {
        delete process.env.ENV;
        delete process.env.BU_CODE;

        const result = controller.get();

        expect(result['running on']).toContain('undefined');
      });

      it('should return all required properties', () => {
        const result = controller.get();

        expect(result).toHaveProperty('status');
        expect(result).toHaveProperty('running on');
        expect(result).toHaveProperty('listening on');
        expect(result).toHaveProperty('admin on');
      });
    });
  });
});
