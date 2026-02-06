import { Module } from '@nestjs/common';
import { BackendApiModule } from '../backend-api/backend-api.module';
import { ProductsModule } from '../products/products.module';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';

@Module({
  imports: [BackendApiModule, ProductsModule],
  controllers: [ConfigController],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
