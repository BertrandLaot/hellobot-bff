import { Controller, Get, Module } from '@nestjs/common';

@Controller('info')
class HealthController {
  constructor() {}

  @Get('/')
  get() {
    return {
      status: 'ok',
      'running on': `${process.env.ENV}, ${process.env.BU_CODE}`,
      'listening on': process.env.PORT,
      'admin on': process.env.PORT,
    };
  }
}

@Module({
  controllers: [HealthController],
  providers: [],
})
export class HealthModule {}