// src/properties/properties.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { Property } from './entities/property.entity';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { BookingsModule } from '../bookings/bookings.module';
import { PropertyRepository } from './repositories/property.repository';
import { SocialAssistanceModule } from '../social-assistance/social-assistance.module';
import { User } from '../users/entities/user.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { SocialAssistance } from '../social-assistance/entities/social-assistance.entity';
@Module({
  imports: [
    SequelizeModule.forFeature([Property, User, Booking, SocialAssistance]), 
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
    forwardRef(() => BookingsModule),
    forwardRef(() => SocialAssistanceModule),
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService, PropertyRepository],
  exports: [PropertiesService, PropertyRepository],
})
export class PropertiesModule {}
