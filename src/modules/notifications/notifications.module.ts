import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';
import { ListingNotificationListener } from './listeners/listing-notification.listener';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.secret') ?? '',
      }),
    }),
  ],
  providers: [NotificationsGateway, NotificationsService, ListingNotificationListener],
  exports: [NotificationsService],
})
export class NotificationsModule {}
