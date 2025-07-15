import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { FindOptions } from 'sequelize';

@Injectable()
export class TasksRepository {
  constructor(
    @InjectModel(Task)
    private readonly taskModel: typeof Task,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskModel.create(createTaskDto);
  }

  async findAll(options?: FindOptions<Task>): Promise<Task[]> {
    return this.taskModel.findAll(options);
  }

  async findOne(id: string, options?: FindOptions<Task>): Promise<Task | null> {
    return this.taskModel.findByPk(id, options);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<[number, Task[]]> {
    return this.taskModel.update(updateTaskDto, {
      where: { id },
      returning: true,
    });
  }

  async remove(id: string): Promise<number> {
    return this.taskModel.destroy({
      where: { id },
    });
  }
} 