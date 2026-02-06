import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BackendApiModule } from '../backend-api/backend-api.module';

@Module({
  imports: [BackendApiModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
