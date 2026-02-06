import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class BearerTokenInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const bearerToken = this.configService.get<string>('BACKEND_BEARER_TOKEN');

    if (bearerToken && request.headers) {
      request.headers['Authorization'] = `Bearer ${bearerToken}`;
    }

    return next.handle();
  }
}
