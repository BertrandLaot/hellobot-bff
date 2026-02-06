import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { BackendApiService } from './backend-api.service';
import { BearerTokenInterceptor } from './interceptors/bearer-token.interceptor';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
    ConfigModule,
  ],
  providers: [BackendApiService, BearerTokenInterceptor],
  exports: [BackendApiService],
})
export class BackendApiModule {}
