import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './repositories/tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.create(createTaskDto);
  }

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.findAll({
      include: ['userTasks'],
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne(id, {
      include: ['userTasks'],
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const [affectedCount, affectedRows] = await this.tasksRepository.update(id, updateTaskDto);
    if (affectedCount === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return affectedRows[0];
  }

  async remove(id: string): Promise<void> {
    const affectedCount = await this.tasksRepository.remove(id);
    if (affectedCount === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
} 