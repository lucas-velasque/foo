// src/modules/bookings/dto/update-booking.dto.ts
import { IsOptional, IsUUID, IsNumber, IsEnum, Min } from 'class-validator';
import { BookingStatus } from '../bookings.service';

export class UpdateBookingDto {
  @IsOptional()
  @IsUUID()
  property_id?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  number_of_days?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  work_hours_offered?: number;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}