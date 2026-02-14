import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { CommentController } from './controllers/comment.controller';
import { RatingController } from './controllers/rating.controller';
import { FavoriteController } from './controllers/favorite.controller';
import { ContactRequestController } from './controllers/contact-request.controller';
import { AppointmentController } from './controllers/appointment.controller';
import { CreateListingUseCase } from './use-cases/create-listing.use-case';
import { UpdateListingUseCase } from './use-cases/update-listing.use-case';
import { DeleteListingUseCase } from './use-cases/delete-listing.use-case';
import { ListListingsUseCase } from './use-cases/list-listings.use-case';
import { GetListingUseCase } from './use-cases/get-listing.use-case';
import { GetListingByCodeUseCase } from './use-cases/get-listing-by-code.use-case';
import { GenerateUniqueListingCodeUseCase } from './use-cases/generate-unique-listing-code.use-case';
import { CreateCommentUseCase } from './use-cases/create-comment.use-case';
import { ListCommentsUseCase } from './use-cases/list-comments.use-case';
import { SetRatingUseCase } from './use-cases/set-rating.use-case';
import { GetListingRatingUseCase } from './use-cases/get-listing-rating.use-case';
import { AddFavoriteUseCase } from './use-cases/add-favorite.use-case';
import { RemoveFavoriteUseCase } from './use-cases/remove-favorite.use-case';
import { ListMyFavoritesUseCase } from './use-cases/list-my-favorites.use-case';
import { CreateContactRequestUseCase } from './use-cases/create-contact-request.use-case';
import { ListMyContactRequestsUseCase } from './use-cases/list-my-contact-requests.use-case';
import { CreateAppointmentUseCase } from './use-cases/create-appointment.use-case';
import { UpdateAppointmentUseCase } from './use-cases/update-appointment.use-case';
import { DeleteAppointmentUseCase } from './use-cases/delete-appointment.use-case';
import { ListMyAppointmentsUseCase } from './use-cases/list-my-appointments.use-case';
import { ListListingAppointmentsUseCase } from './use-cases/list-listing-appointments.use-case';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
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
  ],
  controllers: [
    ListingController,
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
    GetListingUseCase,
    GetListingByCodeUseCase,
    CreateCommentUseCase,
    ListCommentsUseCase,
    SetRatingUseCase,
    GetListingRatingUseCase,
    AddFavoriteUseCase,
    RemoveFavoriteUseCase,
    ListMyFavoritesUseCase,
    CreateContactRequestUseCase,
    ListMyContactRequestsUseCase,
    CreateAppointmentUseCase,
    UpdateAppointmentUseCase,
    DeleteAppointmentUseCase,
    ListMyAppointmentsUseCase,
    ListListingAppointmentsUseCase,
  ],
  exports: [FavoriteService, ContactRequestService, AppointmentService],
})
export class ListingsModule {}
