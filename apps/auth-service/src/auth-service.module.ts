import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from '@app/common';
import { KafkaModule } from '@app/kafka';

import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule.register('auth'),
    KafkaModule.register('auth-service-group'),
    UsersModule,
    AuthModule,
  ],
 

})
export class AuthServiceModule {}
