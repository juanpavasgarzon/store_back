import {
  Controller,
  Get,
  Put,
  Body,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { RequirePermissions } from '../../../shared';
import { PERMISSIONS } from '../../../shared/security';
import { UpdateContactConfigUseCase } from '../use-cases/update-contact-config.use-case';
import { GetContactConfigUseCase } from '../use-cases/get-contact-config.use-case';
import { UpdateContactConfigRequestDto } from '../dto/request/contact-config.dto';
import { ContactConfigResponseDto } from '../dto/response/contact-config-response.dto';

@Controller('contact')
export class ContactController {
  constructor(
    private readonly updateContactConfigUseCase: UpdateContactConfigUseCase,
    private readonly getContactConfigUseCase: GetContactConfigUseCase,
  ) {}

  @RequirePermissions(PERMISSIONS.CONTACT_CONFIG_READ)
  @Get('config')
  @HttpCode(HttpStatus.OK)
  async getConfig(): Promise<ContactConfigResponseDto> {
    const config = await this.getContactConfigUseCase.execute();
    if (!config) {
      throw new NotFoundException('Contact configuration not found');
    }
    return new ContactConfigResponseDto(config);
  }

  @RequirePermissions(PERMISSIONS.CONTACT_CONFIG_UPDATE)
  @Put('config')
  @HttpCode(HttpStatus.OK)
  async updateConfig(
    @Body() dto: UpdateContactConfigRequestDto,
  ): Promise<ContactConfigResponseDto> {
    const config = await this.updateContactConfigUseCase.execute(dto);
    return new ContactConfigResponseDto(config);
  }
}
