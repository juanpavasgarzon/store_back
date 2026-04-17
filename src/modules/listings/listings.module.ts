import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Listing } from './entities/listing.entity';
import { ListingPhoto } from './entities/listing-photo.entity';
import { ListingAttributeValue } from './entities/listing-attribute-value.entity';
import { Favorite } from './entities/favorite.entity';
import { ContactRequest } from './entities/contact-request.entity';
import { ListingReport } from './entities/listing-report.entity';
import { ListingView } from './entities/listing-view.entity';
import { ListingCodeService } from './services/listing-code.service';
import { ListingService } from './services/listing.service';
import { S3StorageService } from './services/s3-storage.service';
import { FavoriteService } from './services/favorite.service';
import { ContactRequestService } from './services/contact-request.service';
import { STORAGE_SERVICE } from './interfaces/storage-service.interface';
import { ListingController } from './controllers/listing.controller';
import { ListingPhotoController } from './controllers/listing-photo.controller';
import { ListingByCategoryController } from './controllers/listing-by-category.controller';
import { FavoriteController } from './controllers/favorite.controller';
import { ContactRequestController } from './controllers/contact-request.controller';
import { ListingReportController } from './controllers/listing-report.controller';
import { CreateListingUseCase } from './use-cases/create-listing.use-case';
import { UpdateListingUseCase } from './use-cases/update-listing.use-case';
import { DeleteListingUseCase } from './use-cases/delete-listing.use-case';
import { ListListingsUseCase } from './use-cases/list-listings.use-case';
import { GetListingUseCase } from './use-cases/get-listing.use-case';
import { GetListingByCodeUseCase } from './use-cases/get-listing-by-code.use-case';
import { GenerateUniqueListingCodeUseCase } from './use-cases/generate-unique-listing-code.use-case';
import { ListListingsByCategoryUseCase } from './use-cases/list-listings-by-category.use-case';
import { CountListingsUseCase } from './use-cases/count-listings.use-case';
import { AddFavoriteUseCase } from './use-cases/add-favorite.use-case';
import { RemoveFavoriteUseCase } from './use-cases/remove-favorite.use-case';
import { ListMyFavoritesUseCase } from './use-cases/list-my-favorites.use-case';
import { CreateContactRequestUseCase } from './use-cases/create-contact-request.use-case';
import { ListMyContactRequestsUseCase } from './use-cases/list-my-contact-requests.use-case';
import { ListReceivedContactRequestsUseCase } from './use-cases/list-received-contact-requests.use-case';
import { ListMyListingsUseCase } from './use-cases/list-my-listings.use-case';
import { UploadListingPhotosUseCase } from './use-cases/upload-listing-photos.use-case';
import { ListListingPhotosUseCase } from './use-cases/list-listing-photos.use-case';
import { GetListingPhotoFileUseCase } from './use-cases/get-listing-photo-file.use-case';
import { ExpireListingsUseCase } from './use-cases/expire-listings.use-case';
import { ListingSchedulerService } from './services/listing-scheduler.service';
import { CreateListingReportUseCase } from './use-cases/create-listing-report.use-case';
import { ListListingReportsUseCase } from './use-cases/list-listing-reports.use-case';
import { UpdateListingReportStatusUseCase } from './use-cases/update-listing-report-status.use-case';
import { RegisterListingViewUseCase } from './use-cases/register-listing-view.use-case';
import { GetListingStatsUseCase } from './use-cases/get-listing-stats.use-case';
import { ExportListingsCsvUseCase } from './use-cases/export-listings-csv.use-case';
import { ListTrendingListingsUseCase } from './use-cases/list-trending-listings.use-case';
import { CategoriesModule } from '../categories/categories.module';
import { Category } from '../categories/entities/category.entity';
import { User } from '../users/entities/user.entity';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    MulterModule.register({ storage: memoryStorage() }),
    TypeOrmModule.forFeature([
      Listing,
      Category,
      ListingPhoto,
      ListingAttributeValue,
      Favorite,
      ContactRequest,
      ListingReport,
      ListingView,
      User,
    ]),
    CategoriesModule,
    AuditModule,
  ],
  controllers: [
    ListingController,
    ListingByCategoryController,
    ListingPhotoController,
    FavoriteController,
    ContactRequestController,
    ListingReportController,
  ],
  providers: [
    {
      provide: STORAGE_SERVICE,
      useClass: S3StorageService,
    },
    GenerateUniqueListingCodeUseCase,
    ListingCodeService,
    ListingService,
    S3StorageService,
    FavoriteService,
    ContactRequestService,
    CreateListingUseCase,
    UpdateListingUseCase,
    DeleteListingUseCase,
    ListListingsUseCase,
    GetListingUseCase,
    GetListingByCodeUseCase,
    ListListingsByCategoryUseCase,
    CountListingsUseCase,
    AddFavoriteUseCase,
    RemoveFavoriteUseCase,
    ListMyFavoritesUseCase,
    CreateContactRequestUseCase,
    ListMyContactRequestsUseCase,
    ListReceivedContactRequestsUseCase,
    ListMyListingsUseCase,
    UploadListingPhotosUseCase,
    ListListingPhotosUseCase,
    GetListingPhotoFileUseCase,
    ExpireListingsUseCase,
    ListingSchedulerService,
    CreateListingReportUseCase,
    ListListingReportsUseCase,
    UpdateListingReportStatusUseCase,
    RegisterListingViewUseCase,
    GetListingStatsUseCase,
    ExportListingsCsvUseCase,
    ListTrendingListingsUseCase,
  ],
  exports: [FavoriteService, ContactRequestService, ListingService],
})
export class ListingsModule {}
