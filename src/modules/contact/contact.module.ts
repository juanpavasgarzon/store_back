import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactConfig } from './entities/contact-config.entity';
import { ContactConfigService } from './services/contact-config.service';
import { ContactController } from './controllers/contact.controller';
import { FindContactConfigUseCase } from './use-cases/find-contact-config.use-case';
import { SaveContactConfigUseCase } from './use-cases/save-contact-config.use-case';
import { UpdateContactConfigUseCase } from './use-cases/update-contact-config.use-case';
import { GetContactConfigUseCase } from './use-cases/get-contact-config.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([ContactConfig])],
  controllers: [ContactController],
  providers: [
    ContactConfigService,
    FindContactConfigUseCase,
    SaveContactConfigUseCase,
    UpdateContactConfigUseCase,
    GetContactConfigUseCase,
  ],
  exports: [ContactConfigService],
})
export class ContactModule {}
