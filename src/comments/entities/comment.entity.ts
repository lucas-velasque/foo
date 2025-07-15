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


interface CommentAttributes {
  id: string;
  content: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CommentCreationAttributes extends Partial<CommentAttributes> {}

@Table({
  tableName: 'comments',
  timestamps: true,
  underscored: true,
})
export class Comment extends Model<CommentAttributes, CommentCreationAttributes> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'O conteúdo do comentário não pode estar vazio',
      },
      len: {
        args: [1, 1000],
        msg: 'O comentário deve ter entre 1 e 1000 caracteres',
      },
    },
  })
  declare content: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare userId: string;

  @BelongsTo(() => User)
  declare user: User;
}

