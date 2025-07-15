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
import { Task } from './task.entity';

interface UserTaskAttributes {
  id: string;
  user_id: string;
  task_id: string;
  status?: string;
  completed_at?: Date;
}

interface UserTaskCreationAttributes extends Partial<UserTaskAttributes> {}

@Table({
  tableName: 'user_tasks',
  timestamps: true,
  underscored: true,
})
export class UserTask extends Model<UserTaskAttributes, UserTaskCreationAttributes> {
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
  })
  declare user_id: string;

  @ForeignKey(() => Task)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare task_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare status?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare completed_at?: Date;

  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => Task)
  declare task: Task;
} 