// src/config/database.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from './database.config';
import { User } from '../users/entities/user.entity';
import { Property } from '../properties/entities/property.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { WorkCredit } from '../work-credits/entities/work-credit.entity';
import { SocialAssistance } from '../social-assistance/entities/social-assistance.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfig.useFactory,
      inject: databaseConfig.inject,
    }),
  ],
})
export class DatabaseModule {}
