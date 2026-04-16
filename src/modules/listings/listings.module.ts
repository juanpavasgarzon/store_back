import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Listing } from './entities/listing.entity';
import { ListingPhoto } from './entities/listing-photo.entity';
import { ListingVariantValue } from './entities/listing-variant-value.entity';
import { Comment } from './entities/comment.entity';
import { Rating } from './entities/rating.entity';
import { Favorite } from './entities/favorite.entity';
import { FavoriteCollection } from './entities/favorite-collection.entity';
import { ContactRequest } from './entities/contact-request.entity';
import { Appointment } from './entities/appointment.entity';
import { ListingReport } from './entities/listing-report.entity';
import { ListingView } from './entities/listing-view.entity';
import { ListingPriceHistory } from './entities/listing-price-history.entity';
import { ListingCodeService } from './services/listing-code.service';
import { S3StorageService } from './services/s3-storage.service';
import { FavoriteService } from './services/favorite.service';
import { ContactRequestService } from './services/contact-request.service';
import { AppointmentService } from './services/appointment.service';
import { STORAGE_SERVICE } from './interfaces/storage-service.interface';
import { ListingController } from './controllers/listing.controller';
import { ListingPhotoController } from './controllers/listing-photo.controller';
import { CommentController } from './controllers/comment.controller';
import { ListingByCategoryController } from './controllers/listing-by-category.controller';
import { RatingController } from './controllers/rating.controller';
import { FavoriteController } from './controllers/favorite.controller';
import { FavoriteCollectionController } from './controllers/favorite-collection.controller';
import { ContactRequestController } from './controllers/contact-request.controller';
import { AppointmentController } from './controllers/appointment.controller';
import { ListingReportController } from './controllers/listing-report.controller';
import { CreateListingUseCase } from './use-cases/create-listing.use-case';
import { UpdateListingUseCase } from './use-cases/update-listing.use-case';
import { DeleteListingUseCase } from './use-cases/delete-listing.use-case';
import { ListListingsUseCase } from './use-cases/list-listings.use-case';
import { ListNearbyListingsUseCase } from './use-cases/list-nearby-listings.use-case';
import { GetListingUseCase } from './use-cases/get-listing.use-case';
import { GetListingByCodeUseCase } from './use-cases/get-listing-by-code.use-case';
import { GenerateUniqueListingCodeUseCase } from './use-cases/generate-unique-listing-code.use-case';
import { CreateCommentUseCase } from './use-cases/create-comment.use-case';
import { ListCommentsUseCase } from './use-cases/list-comments.use-case';
import { DeleteCommentUseCase } from './use-cases/delete-comment.use-case';
import { ListListingsByCategoryUseCase } from './use-cases/list-listings-by-category.use-case';
import { ListMyRatingsUseCase } from './use-cases/list-my-ratings.use-case';
import { RatingService } from './services/rating.service';
import { SetRatingUseCase } from './use-cases/set-rating.use-case';
import { GetListingRatingUseCase } from './use-cases/get-listing-rating.use-case';
import { GetMyRatingForListingUseCase } from './use-cases/get-my-rating-for-listing.use-case';
import { ListListingRatingsUseCase } from './use-cases/list-listing-ratings.use-case';
import { CountListingsUseCase } from './use-cases/count-listings.use-case';
import { AddFavoriteUseCase } from './use-cases/add-favorite.use-case';
import { RemoveFavoriteUseCase } from './use-cases/remove-favorite.use-case';
import { ListMyFavoritesUseCase } from './use-cases/list-my-favorites.use-case';
import { CreateContactRequestUseCase } from './use-cases/create-contact-request.use-case';
import { UpdateContactRequestStatusUseCase } from './use-cases/update-contact-request-status.use-case';
import { ListMyContactRequestsUseCase } from './use-cases/list-my-contact-requests.use-case';
import { CreateAppointmentUseCase } from './use-cases/create-appointment.use-case';
import { UpdateAppointmentUseCase } from './use-cases/update-appointment.use-case';
import { DeleteAppointmentUseCase } from './use-cases/delete-appointment.use-case';
import { ListMyAppointmentsUseCase } from './use-cases/list-my-appointments.use-case';
import { ListMyListingsUseCase } from './use-cases/list-my-listings.use-case';
import { ListListingAppointmentsUseCase } from './use-cases/list-listing-appointments.use-case';
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
import { GetListingPriceHistoryUseCase } from './use-cases/get-listing-price-history.use-case';
import { CompareListingsUseCase } from './use-cases/compare-listings.use-case';
import { BoostListingUseCase } from './use-cases/boost-listing.use-case';
import { ExpireListingBoostsUseCase } from './use-cases/expire-listing-boosts.use-case';
import { ExportListingsCsvUseCase } from './use-cases/export-listings-csv.use-case';
import { ListTrendingListingsUseCase } from './use-cases/list-trending-listings.use-case';
import { CreateFavoriteCollectionUseCase } from './use-cases/create-favorite-collection.use-case';
import { ListFavoriteCollectionsUseCase } from './use-cases/list-favorite-collections.use-case';
import { DeleteFavoriteCollectionUseCase } from './use-cases/delete-favorite-collection.use-case';
import { AssignFavoriteCollectionUseCase } from './use-cases/assign-favorite-collection.use-case';
import { CategoriesModule } from '../categories/categories.module';
import { Category } from '../categories/entities/category.entity';
import { ContactModule } from '../contact/contact.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    MulterModule.register({ storage: memoryStorage() }),
    TypeOrmModule.forFeature([
      Listing,
      Category,
      ListingPhoto,
      ListingVariantValue,
      Comment,
      Rating,
      Favorite,
      FavoriteCollection,
      ContactRequest,
      Appointment,
      ListingReport,
      ListingView,
      ListingPriceHistory,
    ]),
    CategoriesModule,
    ContactModule,
    AuditModule,
  ],
  controllers: [
    ListingController,
    ListingByCategoryController,
    ListingPhotoController,
    CommentController,
    RatingController,
    FavoriteController,
    FavoriteCollectionController,
    ContactRequestController,
    AppointmentController,
    ListingReportController,
  ],
  providers: [
    {
      provide: STORAGE_SERVICE,
      useClass: S3StorageService,
    },
    GenerateUniqueListingCodeUseCase,
    ListingCodeService,
    S3StorageService,
    FavoriteService,
    ContactRequestService,
    AppointmentService,
    CreateListingUseCase,
    UpdateListingUseCase,
    DeleteListingUseCase,
    ListListingsUseCase,
    ListNearbyListingsUseCase,
    GetListingUseCase,
    GetListingByCodeUseCase,
    CreateCommentUseCase,
    ListCommentsUseCase,
    DeleteCommentUseCase,
    ListListingsByCategoryUseCase,
    ListMyRatingsUseCase,
    RatingService,
    SetRatingUseCase,
    GetListingRatingUseCase,
    GetMyRatingForListingUseCase,
    ListListingRatingsUseCase,
    CountListingsUseCase,
    AddFavoriteUseCase,
    RemoveFavoriteUseCase,
    ListMyFavoritesUseCase,
    CreateContactRequestUseCase,
    UpdateContactRequestStatusUseCase,
    ListMyContactRequestsUseCase,
    CreateAppointmentUseCase,
    UpdateAppointmentUseCase,
    DeleteAppointmentUseCase,
    ListMyAppointmentsUseCase,
    ListListingAppointmentsUseCase,
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
    GetListingPriceHistoryUseCase,
    CompareListingsUseCase,
    BoostListingUseCase,
    ExpireListingBoostsUseCase,
    ExportListingsCsvUseCase,
    ListTrendingListingsUseCase,
    CreateFavoriteCollectionUseCase,
    ListFavoriteCollectionsUseCase,
    DeleteFavoriteCollectionUseCase,
    AssignFavoriteCollectionUseCase,
  ],
  exports: [
    FavoriteService,
    ContactRequestService,
    AppointmentService,
    ListMyListingsUseCase,
    RatingService,
  ],
})
export class ListingsModule {}
