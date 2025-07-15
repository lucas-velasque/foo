import { Table, Column, Model, PrimaryKey, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'social_assistances',
  timestamps: true,
  underscored: true,
  modelName: 'SocialAssistance',
})
export class SocialAssistance extends Model<SocialAssistance> {
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
  declare ong_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare contact_person: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare contact_email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare contact_phone: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string;
}
