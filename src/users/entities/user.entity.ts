import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { Property } from '../../properties/entities/property.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { WorkCredit } from '../../work-credits/entities/work-credit.entity';

export enum UserRole {
  USER = 'user',
    SUPPLIER = 'supplier',
  ADMIN = 'admin',
}

interface UserAttributes {
  id: string;
  name: string;
  cpf: string;
  email: string;
  password: string;
  role: UserRole;
}

interface UserCreationAttributes extends Partial<UserAttributes> {}

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
})
export class User extends Model<UserAttributes, UserCreationAttributes> {
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
    unique: true,
  })
  declare cpf: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
    defaultValue: UserRole.USER,
    validate: {
      isIn: [Object.values(UserRole)],
    },
  })
  declare role: UserRole;

  @HasMany(() => Property, 'owner_id')
  declare properties: Property[];

  @HasMany(() => Booking, 'guest_id')
  declare bookings: Booking[];

  @HasMany(() => WorkCredit, 'user_id')
  declare workCredits: WorkCredit[];
}
