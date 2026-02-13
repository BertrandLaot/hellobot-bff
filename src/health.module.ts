import { Controller, Get, Module } from '@nestjs/common';

@Controller('info')
class HealthController {
  constructor() {}

  @Get('/')
  get() {
    return {
      status: 'ok',
      'running on': `${process.env.ENV}, ${process.env.BU_CODE}`,
      'listening on': process.env.PORT || 8080,
      'admin on': process.env.HEALTH_PORT || 8081,
    };
  }
}

@Module({
  controllers: [HealthController],
  providers: [],
})
export class HealthModule {}