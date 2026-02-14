import { Controller, Get, Put, Body, Res, HttpCode, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { CurrentUser, RequirePermissions } from '../../../shared';
import { PERMISSIONS } from '../../../shared/constants';
import type { IUser } from '../../../shared';
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
  async getConfig(
    @CurrentUser() user: IUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ContactConfigResponseDto | void> {
    const config = await this.getContactConfigUseCase.execute(user);
    if (!config) {
      res.status(HttpStatus.NO_CONTENT).end();
      return;
    }
    return new ContactConfigResponseDto(config);
  }

  @RequirePermissions(PERMISSIONS.CONTACT_CONFIG_UPDATE)
  @Put('config')
  @HttpCode(HttpStatus.OK)
  async updateConfig(
    @CurrentUser() user: IUser,
    @Body() dto: UpdateContactConfigRequestDto,
  ): Promise<ContactConfigResponseDto> {
    const config = await this.updateContactConfigUseCase.execute(user, dto);
    return new ContactConfigResponseDto(config);
  }
}
