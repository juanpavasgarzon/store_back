import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'password must be at least 8 characters' })
  @Matches(/[A-Z]/, { message: 'password must contain at least one uppercase letter' })
  @Matches(/[0-9]/, { message: 'password must contain at least one number' })
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;
}
