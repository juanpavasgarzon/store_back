import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ListingsModule } from './modules/listings/listings.module';
import { ContactModule } from './modules/contact/contact.module';
import { LegalModule } from './modules/legal/legal.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    ListingsModule,
    ContactModule,
    LegalModule,
  ],
})
export class AppModule {}
