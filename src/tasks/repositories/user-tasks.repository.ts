import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserTask } from '../entities/user-task.entity';
import { CreateUserTaskDto } from '../dto/create-user-task.dto';
import { UpdateUserTaskDto } from '../dto/update-user-task.dto';
import { FindOptions } from 'sequelize';

@Injectable()
export class UserTasksRepository {
  constructor(
    @InjectModel(UserTask)
    private readonly userTaskModel: typeof UserTask,
  ) {}

  async create(createUserTaskDto: CreateUserTaskDto): Promise<UserTask> {
    return this.userTaskModel.create(createUserTaskDto);
  }

  async findAll(options?: FindOptions<UserTask>): Promise<UserTask[]> {
    return this.userTaskModel.findAll(options);
  }

  async findOne(id: string, options?: FindOptions<UserTask>): Promise<UserTask | null> {
    return this.userTaskModel.findByPk(id, options);
  }

  async findByUserAndTask(userId: string, taskId: string): Promise<UserTask | null> {
    return this.userTaskModel.findOne({
      where: { user_id: userId, task_id: taskId },
    });
  }

  async update(id: string, updateUserTaskDto: UpdateUserTaskDto): Promise<[number, UserTask[]]> {
    const updateData = {
      ...updateUserTaskDto,
      completed_at: updateUserTaskDto.completed_at ? new Date(updateUserTaskDto.completed_at) : undefined,
    };
    return this.userTaskModel.update(updateData, {
      where: { id },
      returning: true,
    });
  }

  async remove(id: string): Promise<number> {
    return this.userTaskModel.destroy({
      where: { id },
    });
  }

  async removeByUserAndTask(userId: string, taskId: string): Promise<number> {
    return this.userTaskModel.destroy({
      where: { user_id: userId, task_id: taskId },
    });
  }
} 