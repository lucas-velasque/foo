import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { User } from '../users/entities/user.entity';
import { Booking } from './entities/booking.entity';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard) 
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Roles(UserRole.USER, UserRole.ADMIN)
  async create(@Request() req: any, @Body() createBookingDto: CreateBookingDto) {
    const guestId = req.user.role === 'admin' && createBookingDto.guest_id ? createBookingDto.guest_id : req.user.id;
    return this.bookingsService.create(guestId, createBookingDto.property_id, createBookingDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.SUPPLIER)
  async findAll(@Request() req: any) {
    return this.bookingsService.findAll(req.user);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.SUPPLIER)
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.bookingsService.findOne(id, req.user);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.SUPPLIER)
  async update(@Request() req: any, @Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(id, updateBookingDto, req.user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.SUPPLIER)
  async remove(@Request() req: any, @Param('id') id: string) {
    await this.bookingsService.remove(id, req.user);
    return { message: `Reserva com ID ${id} removida com sucesso.` };
  }

  @Put(':id/approve')
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN)
  async approveBooking(@Request() req: any, @Param('id') id: string) {
    return this.bookingsService.approveBooking(id, req.user);
  }

  @Put(':id/reject')
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN)
  async rejectBooking(@Request() req: any, @Param('id') id: string) {
    return this.bookingsService.rejectBooking(id, req.user);
  }

  @Get('test')
  async test() {
    return { message: 'BookingsController está ativo!' };
  }
}