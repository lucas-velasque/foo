import { Injectable, Inject, forwardRef, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { UsersService } from '../users/users.service';
import { PropertiesService } from '../properties/properties.service';
import { BookingsRepository } from './repositories/bookings.repository';
import { Op } from 'sequelize';
import { User } from '../users/entities/user.entity';
import { Property } from '../properties/entities/property.entity';

import { BookingStatus } from './enums/booking-status.enum';

@Injectable()
export class BookingsService {
  constructor(
    @Inject(forwardRef(() => BookingsRepository))
    private readonly bookingsRepository: BookingsRepository,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    @Inject(forwardRef(() => PropertiesService))
    private readonly propertiesService: PropertiesService,

    @InjectModel(Booking)
    private readonly bookingModel: typeof Booking,
  ) {}

  async create(guestId: string, propertyId: string, createBookingDto: CreateBookingDto): Promise<Booking> {
    console.log('--- [BOOKING CREATE] ---');
    console.log('guestId:', guestId);
    console.log('propertyId:', propertyId);
    console.log('createBookingDto:', createBookingDto);
    try {
      const guest = await this.usersService.findById(guestId);
      console.log('guest:', guest);
      if (!guest || guest.role !== 'user') {
        console.log('Usuário não encontrado ou não é user');
        throw new UnauthorizedException('Apenas usuários podem criar reservas.');
      }
      const property = await this.propertiesService.findOne(propertyId);
      console.log('property:', property);
      if (!property) {
        const allPropertiesResult = await this.propertiesService.findAll?.() || { data: [] };
        const allIds = allPropertiesResult.data.map((p: any) => p.id);
        console.error('[BOOKING CREATE] Propriedade não encontrada! propertyId enviado:', propertyId);
        console.error('[BOOKING CREATE] IDs de propriedades disponíveis:', allIds);
        throw new NotFoundException(`Propriedade com ID ${propertyId} não encontrada. IDs válidos: ${allIds.join(', ')}`);
      }
      const booking = await this.bookingsRepository.create({ ...createBookingDto, guest_id: guestId, property_id: propertyId, status: BookingStatus.PENDING });
      console.log('Reserva criada:', booking);
      return booking;
    } catch (err) {
      console.error('Erro ao criar reserva:', err);
      throw err;
    }
  }

  async findAll(requestingUser: User): Promise<Booking[]> {
    if (requestingUser.role === 'admin') {
      return this.bookingsRepository.findAll({
        include: [
          { model: User, as: 'guest', attributes: ['id', 'name', 'email'] },
          { model: Property, as: 'property', attributes: ['id', 'name', 'location'] },
        ],
      });
    }
    if (requestingUser.role === 'user') {
      return this.bookingsRepository.findAll({
        where: { guest_id: requestingUser.id },
        include: [
          { model: User, as: 'guest', attributes: ['id', 'name', 'email'] },
          { model: Property, as: 'property', attributes: ['id', 'name', 'location'] },
        ],
      });
    }
    if (requestingUser.role === 'supplier') {
      const properties = await this.propertiesService.findBySupplierId(requestingUser.id);
      const propertyIds = properties.map((p) => p.id);
      return this.bookingsRepository.findAll({
        where: { property_id: propertyIds },
        include: [
          { model: User, as: 'guest', attributes: ['id', 'name', 'email'] },
          { model: Property, as: 'property', attributes: ['id', 'name', 'location'] },
        ],
      });
    }
    return [];
  }

  async findOne(id: string, requestingUser: User): Promise<Booking> {
    const booking = await this.bookingsRepository.findByPk(id, {
      include: [
        {
          model: User,
          as: 'guest',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'name', 'location'],
        },
      ],
    });
    if (!booking) {
      throw new NotFoundException(`Reserva com ID ${id} não encontrada`);
    }
    if (requestingUser.role === 'admin') return booking;
    if (requestingUser.role === 'user' && booking.guest_id !== requestingUser.id) {
      throw new UnauthorizedException('Você só pode acessar suas próprias reservas.');
    }
    if (requestingUser.role === 'supplier') {
      const property = await this.propertiesService.findOne(booking.property_id);
      if (property.owner_id !== requestingUser.id) {
        throw new UnauthorizedException('Você só pode acessar reservas das suas propriedades.');
      }
    }
    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto, requestingUser: User): Promise<Booking> {
    const booking = await this.findOne(id, requestingUser);
    if (requestingUser.role === 'admin') {
      await this.bookingsRepository.update(id, updateBookingDto);
      return this.findOne(id, requestingUser);
    }
    if (requestingUser.role === 'user' && booking.guest_id === requestingUser.id) {
      await this.bookingsRepository.update(id, updateBookingDto);
      return this.findOne(id, requestingUser);
    }
    if (requestingUser.role === 'supplier') {
      const property = await this.propertiesService.findOne(booking.property_id);
      if (property.owner_id === requestingUser.id) {
        await this.bookingsRepository.update(id, updateBookingDto);
        return this.findOne(id, requestingUser);
      }
    }
    throw new UnauthorizedException('Sem permissão para atualizar esta reserva.');
  }

  async remove(id: string, requestingUser: User): Promise<void> {
    const booking = await this.findOne(id, requestingUser);
    if (requestingUser.role === 'admin') {
      await this.bookingsRepository.destroy(id);
      return;
    }
    if (requestingUser.role === 'user' && booking.guest_id === requestingUser.id) {
      await this.bookingsRepository.destroy(id);
      return;
    }
    if (requestingUser.role === 'supplier') {
      const property = await this.propertiesService.findOne(booking.property_id);
      if (property.owner_id === requestingUser.id) {
        await this.bookingsRepository.destroy(id);
        return;
      }
    }
    throw new UnauthorizedException('Sem permissão para remover esta reserva.');
  }

  async findPendingByProperty(propertyId: string): Promise<Booking[]> {
    return this.bookingsRepository.findAll({
      where: { property_id: propertyId, status: BookingStatus.PENDING },
      include: [
        {
          model: User,
          as: 'guest',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
  }

  async approveBooking(id: string, requestingUser: User): Promise<Booking> {
    const booking = await this.findOne(id, requestingUser);
    if (requestingUser.role === 'admin') {
      return this.update(id, { status: BookingStatus.APPROVED }, requestingUser);
    }
    if (requestingUser.role === 'supplier') {
      const property = await this.propertiesService.findOne(booking.property_id);
      if (property.owner_id === requestingUser.id) {
        return this.update(id, { status: BookingStatus.APPROVED }, requestingUser);
      }
    }
    throw new UnauthorizedException('Sem permissão para aprovar esta reserva.');
  }

  async rejectBooking(id: string, requestingUser: User): Promise<Booking> {
    const booking = await this.findOne(id, requestingUser);
    if (requestingUser.role === 'admin') {
      return this.update(id, { status: BookingStatus.REJECTED }, requestingUser);
    }
    if (requestingUser.role === 'supplier') {
      const property = await this.propertiesService.findOne(booking.property_id);
      if (property.owner_id === requestingUser.id) {
        return this.update(id, { status: BookingStatus.REJECTED }, requestingUser);
      }
    }
    throw new UnauthorizedException('Sem permissão para rejeitar esta reserva.');
  }

  async hasUserVisitedProperty(userId: string, propertyId: string): Promise<boolean> {
    const booking = await this.bookingsRepository.findOne({
      where: {
        guest_id: userId,
        property_id: propertyId,
        status: BookingStatus.COMPLETED,
      },
    });
    return !!booking;
  }
}


