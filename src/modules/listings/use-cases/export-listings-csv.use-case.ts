import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parser } from 'json2csv';
import { Listing } from '../entities/listing.entity';

interface ListingCsvRow {
  code: string;
  title: string;
  price: string;
  category: string;
  status: string;
  location: string;
  sector: string;
  isBoosted: string;
  createdAt: string;
}

@Injectable()
export class ExportListingsCsvUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  async execute(): Promise<string> {
    const listings = await this.listingRepository.find({
      relations: ['category'],
      order: { createdAt: 'DESC' },
      withDeleted: false,
    });

    const rows: ListingCsvRow[] = listings.map((listing) => ({
      code: listing.code,
      title: listing.title,
      price: listing.price,
      category: listing.category?.name ?? '',
      status: listing.status,
      location: listing.location,
      sector: listing.sector ?? '',
      isBoosted: listing.isBoosted ? 'yes' : 'no',
      createdAt: listing.createdAt.toISOString(),
    }));

    const fields = [
      { label: 'Code', value: 'code' },
      { label: 'Title', value: 'title' },
      { label: 'Price', value: 'price' },
      { label: 'Category', value: 'category' },
      { label: 'Status', value: 'status' },
      { label: 'Location', value: 'location' },
      { label: 'Sector', value: 'sector' },
      { label: 'Boosted', value: 'isBoosted' },
      { label: 'Created At', value: 'createdAt' },
    ];

    const parser = new Parser({ fields });
    return parser.parse(rows);
  }
}
