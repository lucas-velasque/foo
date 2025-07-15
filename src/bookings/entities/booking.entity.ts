import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';
import { Property } from '../../properties/entities/property.entity';
import { BookingStatus } from '../enums/booking-status.enum'; // Enum separado

@Table({
  tableName: 'bookings',
  timestamps: true,
  underscored: true,
})
export class Booking extends Model<Booking> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'guest_id',
  })
  declare guest_id: string;

  @BelongsTo(() => User, 'guest_id')
  declare guest: User;

  @ForeignKey(() => Property)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'property_id',
  })
  declare property_id: string;

  @BelongsTo(() => Property, 'property_id')
  declare property: Property;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'number_of_days',
    comment: 'Número de dias da reserva',
  })
  declare number_of_days: number;

  @Column({
    type: DataType.ENUM(...Object.values(BookingStatus)),
    defaultValue: BookingStatus.PENDING,
  })
  declare status: BookingStatus;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'work_hours_offered',
    defaultValue: 4, // valor padrão de 4 horas
  })
  declare work_hours_offered: number;
}
