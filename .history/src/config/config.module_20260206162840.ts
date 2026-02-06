import { Module } from '@nestjs/common';
import { BackendApiModule } from '../backend-api/backend-api.module';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';

@Module({
  imports: [BackendApiModule],
  controllers: [ConfigController],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
