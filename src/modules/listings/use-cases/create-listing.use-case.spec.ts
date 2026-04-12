import { NotFoundException } from '@nestjs/common';
import { CreateListingUseCase } from './create-listing.use-case';
import { LISTING_STATUS } from '../constants/listing-status.constants';
import type { IUser } from '../../../shared';
import type { CreateListingRequestDto } from '../dto/request/create-listing.dto';

const mockCategory = { id: 'cat-1', name: 'Apartments', slug: 'apartments' };

const mockUser: IUser = {
  id: 'user-1',
  email: 'owner@example.com',
  name: 'Owner',
  role: 'user',
};

const dto: CreateListingRequestDto = {
  categoryId: 'cat-1',
  title: 'Nice apartment',
  description: 'A great place to live',
  price: 500000,
  location: 'Medellín',
  sector: null,
  latitude: null,
  longitude: null,
  status: LISTING_STATUS.ACTIVE,
  expiresAt: null,
  variants: [],
};

describe('CreateListingUseCase', () => {
  let useCase: CreateListingUseCase;
  let listingRepository: jest.Mocked<{ create: jest.Fn; findOne: jest.Fn }>;
  let listingVariantValueRepository: jest.Mocked<{ create: jest.Fn }>;
  let categoryService: jest.Mocked<{ findById: jest.Fn }>;
  let findCategoryVariantsByIdsUseCase: jest.Mocked<{ execute: jest.Fn }>;
  let listingCodeService: jest.Mocked<{ generateUniqueCode: jest.Fn }>;
  let dataSource: jest.Mocked<{ transaction: jest.Fn }>;

  beforeEach(() => {
    listingRepository = { create: jest.fn(), findOne: jest.fn() } as never;
    listingVariantValueRepository = { create: jest.fn() } as never;
    categoryService = { findById: jest.fn() } as never;
    findCategoryVariantsByIdsUseCase = { execute: jest.fn() } as never;
    listingCodeService = { generateUniqueCode: jest.fn() } as never;
    dataSource = { transaction: jest.fn() } as never;

    useCase = new CreateListingUseCase(
      listingRepository as never,
      listingVariantValueRepository as never,
      categoryService as never,
      findCategoryVariantsByIdsUseCase as never,
      listingCodeService as never,
      dataSource as never,
    );
  });

  it('throws NotFoundException when category does not exist', async () => {
    categoryService.findById.mockResolvedValue(null);
    await expect(useCase.execute(mockUser, dto)).rejects.toThrow(NotFoundException);
  });

  it('creates a listing and returns it', async () => {
    const savedId = 'listing-uuid';
    const savedListing = { id: savedId, ...dto, code: 'ABC123', userId: mockUser.id };

    categoryService.findById.mockResolvedValue(mockCategory);
    findCategoryVariantsByIdsUseCase.execute.mockResolvedValue([]);
    listingCodeService.generateUniqueCode.mockResolvedValue('ABC123');

    dataSource.transaction.mockImplementation(async (fn: (m: unknown) => Promise<string>) => {
      const manager = {
        create: jest.fn().mockReturnValue({ id: savedId }),
        save: jest.fn().mockResolvedValue({ id: savedId }),
        delete: jest.fn(),
      };
      return fn(manager);
    });

    listingRepository.findOne.mockResolvedValue({
      ...savedListing,
      category: mockCategory,
      photos: [],
      variants: [],
    });

    const result = await useCase.execute(mockUser, dto);

    expect(categoryService.findById).toHaveBeenCalledWith(dto.categoryId);
    expect(listingCodeService.generateUniqueCode).toHaveBeenCalled();
    expect(result.userId).toBe(mockUser.id);
  });

  it('sanitizes HTML from title and description', async () => {
    const maliciousDto: CreateListingRequestDto = {
      ...dto,
      title: '<script>alert("xss")</script>Title',
      description: '<b>Bold</b> description',
    };

    categoryService.findById.mockResolvedValue(mockCategory);
    findCategoryVariantsByIdsUseCase.execute.mockResolvedValue([]);
    listingCodeService.generateUniqueCode.mockResolvedValue('XYZ999');

    let capturedTitle = '';
    let capturedDescription = '';

    dataSource.transaction.mockImplementation(async (fn: (m: unknown) => Promise<string>) => {
      const manager = {
        create: jest
          .fn()
          .mockImplementation((_entity: unknown, data: { title: string; description: string }) => {
            capturedTitle = data.title;
            capturedDescription = data.description;
            return { id: 'listing-2' };
          }),
        save: jest.fn().mockResolvedValue({ id: 'listing-2' }),
        delete: jest.fn(),
      };
      return fn(manager);
    });

    listingRepository.findOne.mockResolvedValue({
      id: 'listing-2',
      title: capturedTitle,
      description: capturedDescription,
      category: mockCategory,
      photos: [],
      variants: [],
      userId: mockUser.id,
    });

    await useCase.execute(mockUser, maliciousDto);

    expect(capturedTitle).not.toContain('<script>');
    expect(capturedDescription).not.toContain('<b>');
  });
});
