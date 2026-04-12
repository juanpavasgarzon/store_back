import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UploadListingPhotosUseCase } from './upload-listing-photos.use-case';
import type { UploadFileInput } from '../../../shared/files';

const fakeFile = (name = 'photo.jpg'): UploadFileInput => ({
  fieldname: 'photos',
  originalname: name,
  encoding: '7bit',
  mimetype: 'image/jpeg',
  buffer: Buffer.from('fake-image-data'),
  size: 1024,
});

describe('UploadListingPhotosUseCase', () => {
  let useCase: UploadListingPhotosUseCase;
  let listingRepository: jest.Mocked<{ findOne: jest.Fn }>;
  let listingPhotoRepository: jest.Mocked<{ create: jest.Fn; save: jest.Fn; remove: jest.Fn }>;
  let configService: jest.Mocked<{ get: jest.Fn }>;

  beforeEach(() => {
    listingRepository = { findOne: jest.fn() } as never;
    listingPhotoRepository = { create: jest.fn(), save: jest.fn(), remove: jest.fn() } as never;
    configService = { get: jest.fn() } as never;

    useCase = new UploadListingPhotosUseCase(
      listingRepository as never,
      listingPhotoRepository as never,
      configService as never,
    );
  });

  it('throws BadRequestException when no files are provided', async () => {
    await expect(useCase.execute('listing-1', [])).rejects.toThrow(BadRequestException);
  });

  it('throws NotFoundException when listing does not exist', async () => {
    listingRepository.findOne.mockResolvedValue(null);
    await expect(useCase.execute('listing-1', [fakeFile()])).rejects.toThrow(NotFoundException);
  });
});
