// src/modules/properties/entities/property.entity.ts
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { SocialAssistance } from '../../social-assistance/entities/social-assistance.entity';

// Enum para tipo de pagamento
export enum PaymentType {
  WORK_HOURS = 'work_hours',
  MONEY = 'money',
  MIXED = 'mixed',
}

// Enum para período de disponibilidade
export enum AvailabilityPeriod {
  NIGHTLY = 'nightly',
  MONTHLY = 'monthly',
  WEEKLY = 'weekly',
}

@Table({
  tableName: 'properties',
  timestamps: true,
  underscored: true,
})
export class Property extends Model<Property> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare location: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 4, // 4 horas por padrão
  })
  declare daily_work_hours_required: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Preço em dinheiro (opcional)',
  })
  declare price?: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: PaymentType.WORK_HOURS,
    validate: {
      isIn: [Object.values(PaymentType)],
    },
  })
  declare payment_type: PaymentType;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: AvailabilityPeriod.NIGHTLY,
    validate: {
      isIn: [Object.values(AvailabilityPeriod)],
    },
  })
  declare availability_period: AvailabilityPeriod;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Descrição da propriedade',
  })
  declare description?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare is_active: boolean;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare owner_id: string;

  @BelongsTo(() => User, 'owner_id')
  declare owner: User;

  @HasMany(() => Booking)
  declare bookings: Booking[];

  // RELAÇÃO COM SOCIAL ASSISTANCE
  @ForeignKey(() => SocialAssistance)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare social_assistance_id?: string;

  @BelongsTo(() => SocialAssistance, 'social_assistance_id')
  declare socialAssistance?: SocialAssistance;
}
