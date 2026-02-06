import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { BackendApiModule } from './backend-api/backend-api.module';
import { ProductsModule } from './products/products.module';
import { ModulesModule } from './modules/modules.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 86400000, // 24 heures en millisecondes
    }),
    ScheduleModule.forRoot(),
    BackendApiModule,
    ProductsModule,
    ModulesModule,
  ],
})
export class AppModule {}
