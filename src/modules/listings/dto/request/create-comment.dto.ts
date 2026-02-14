import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCommentRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;
}
