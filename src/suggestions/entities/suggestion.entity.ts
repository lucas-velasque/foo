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

@Table({
  tableName: 'suggestions',
  timestamps: true,
  underscored: true,
})
export class Suggestion extends Model<Suggestion> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'user_id',
  })
  user_id!: string;

  @BelongsTo(() => User, 'user_id')
  user!: User;

  @ForeignKey(() => Property)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'property_id',
  })
  property_id!: string;

  @BelongsTo(() => Property, 'property_id')
  property!: Property;
}


