import { IsArray, IsUUID, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class CompareListingsRequestDto {
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(4)
  ids!: string[];
}
