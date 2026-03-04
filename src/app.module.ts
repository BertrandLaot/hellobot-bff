import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { BackendApiModule } from './backend-api/backend-api.module';
import { ProductsModule } from './products/products.module';
import { ModulesModule } from './modules/modules.module';
import { CategoriesModule } from './categories/categories.module';
import { ConfigModule as WidgetConfigModule } from './config/config.module';
import { AdminModule } from './admin/admin.module';

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
    CategoriesModule,
    WidgetConfigModule,
    AdminModule,
  ],
})
export class AppModule {}
