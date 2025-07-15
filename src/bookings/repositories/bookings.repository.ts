import { Injectable, Inject,  forwardRef} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Booking } from '../entities/booking.entity';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';
import { FindOptions } from 'sequelize';

@Injectable()
export class BookingsRepository {
  constructor(
    @InjectModel(Booking)
    private readonly bookingModel: typeof Booking,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    return this.bookingModel.create({ ...createBookingDto } as any);
  }

  async findAll(options?: FindOptions<Booking>): Promise<Booking[]> {
    return this.bookingModel.findAll(options);
  }

  async findByPk(id: string, options?: FindOptions<Booking>): Promise<Booking | null> {
    return this.bookingModel.findByPk(id, options);
  }

  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<[number, Booking[]]> {
    return this.bookingModel.update(updateBookingDto, {
      where: { id },
      returning: true,
    });
  }

  async destroy(id: string): Promise<number> {
    return this.bookingModel.destroy({
      where: { id },
    });
  }

  async findOne(options?: FindOptions<Booking>): Promise<Booking | null> {
    return this.bookingModel.findOne(options);
  }
}