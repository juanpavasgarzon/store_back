import { Injectable } from '@nestjs/common';
import { GenerateUniqueListingCodeUseCase } from '../use-cases/generate-unique-listing-code.use-case';

@Injectable()
export class ListingCodeService {
  constructor(
    private readonly generateUniqueListingCodeUseCase: GenerateUniqueListingCodeUseCase,
  ) {}

  async generateUniqueCode(length: number = 8): Promise<string> {
    return this.generateUniqueListingCodeUseCase.execute(length);
  }
}
