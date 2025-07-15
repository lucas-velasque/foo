import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { UserTask } from './user-task.entity';

interface TaskAttributes {
  id: string;
  name: string;
  description: string;
}

interface TaskCreationAttributes extends Partial<TaskAttributes> {}

@Table({
  tableName: 'tasks',
  timestamps: true,
  underscored: true,
})
export class Task extends Model<TaskAttributes, TaskCreationAttributes> {
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
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string;

  @HasMany(() => UserTask)
  declare userTasks: UserTask[];
} 