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
import { ContactRequest } from './entities/contact-request.entity';
import { Appointment } from './entities/appointment.entity';
import { ListingCodeService } from './services/listing-code.service';
import { FavoriteService } from './services/favorite.service';
import { ContactRequestService } from './services/contact-request.service';
import { AppointmentService } from './services/appointment.service';
import { ListingController } from './controllers/listing.controller';
import { ListingPhotoController } from './controllers/listing-photo.controller';
import { CommentController } from './controllers/comment.controller';
import { RatingController } from './controllers/rating.controller';
import { FavoriteController } from './controllers/favorite.controller';
import { ContactRequestController } from './controllers/contact-request.controller';
import { AppointmentController } from './controllers/appointment.controller';
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
import { SetRatingUseCase } from './use-cases/set-rating.use-case';
import { GetListingRatingUseCase } from './use-cases/get-listing-rating.use-case';
import { ListListingRatingsUseCase } from './use-cases/list-listing-ratings.use-case';
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
import { CategoriesModule } from '../categories/categories.module';
import { ContactModule } from '../contact/contact.module';

@Module({
  imports: [
    MulterModule.register({ storage: memoryStorage() }),
    TypeOrmModule.forFeature([
      Listing,
      ListingPhoto,
      ListingVariantValue,
      Comment,
      Rating,
      Favorite,
      ContactRequest,
      Appointment,
    ]),
    CategoriesModule,
    ContactModule,
  ],
  controllers: [
    ListingController,
    ListingPhotoController,
    CommentController,
    RatingController,
    FavoriteController,
    ContactRequestController,
    AppointmentController,
  ],
  providers: [
    GenerateUniqueListingCodeUseCase,
    ListingCodeService,
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
    SetRatingUseCase,
    GetListingRatingUseCase,
    ListListingRatingsUseCase,
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
  ],
  exports: [FavoriteService, ContactRequestService, AppointmentService, ListMyListingsUseCase],
})
export class ListingsModule {}
