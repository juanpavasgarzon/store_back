import { IsOptional, IsString, MaxLength, MinLength, Matches } from 'class-validator';

export class UpdateProfileRequestDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Matches(/^\+?[0-9\s\-()]{7,20}$/, { message: 'Invalid phone number' })
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Matches(/^\+?[0-9\s\-()]{7,20}$/, { message: 'Invalid whatsapp number' })
  whatsapp?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  city?: string;
}
