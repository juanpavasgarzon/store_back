import { IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRatingRequestDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  score: number;
}
