import { IsString, MinLength, Matches } from 'class-validator';

export class ChangePasswordRequestDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(8, { message: 'newPassword must be at least 8 characters' })
  @Matches(/[A-Z]/, { message: 'newPassword must contain at least one uppercase letter' })
  @Matches(/[0-9]/, { message: 'newPassword must contain at least one number' })
  newPassword: string;
}
