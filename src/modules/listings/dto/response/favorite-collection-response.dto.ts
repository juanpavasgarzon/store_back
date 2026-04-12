import type { FavoriteCollection } from '../../entities/favorite-collection.entity';

export class FavoriteCollectionResponseDto {
  id: string;
  name: string;
  createdAt: string;

  constructor(collection: FavoriteCollection) {
    this.id = collection.id;
    this.name = collection.name;
    this.createdAt = collection.createdAt.toISOString();
  }
}
