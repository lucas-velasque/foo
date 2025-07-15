// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { BookingsModule } from '../bookings/bookings.module'; 
import { forwardRef } from '@nestjs/common'; 

@Module({
  imports: [SequelizeModule.forFeature([User]), forwardRef(() => BookingsModule)], 
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}