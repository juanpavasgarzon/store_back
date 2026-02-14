import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class UpsertLegalDocumentRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  slug: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
