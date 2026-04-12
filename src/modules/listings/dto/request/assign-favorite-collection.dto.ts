import { IsOptional, IsUUID } from 'class-validator';

export class AssignFavoriteCollectionRequestDto {
  @IsOptional()
  @IsUUID()
  collectionId: string | null;
}
