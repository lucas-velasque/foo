import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UserTasksRepository } from './repositories/user-tasks.repository';
import { CreateUserTaskDto } from './dto/create-user-task.dto';
import { UpdateUserTaskDto } from './dto/update-user-task.dto';
import { UserTask } from './entities/user-task.entity';
import { AuthIntegrationService } from '../auth/services/auth-integration.service';

@Injectable()
export class UserTasksService {
  constructor(
    private readonly userTasksRepository: UserTasksRepository,
    private readonly authIntegrationService: AuthIntegrationService,
  ) {}

  async create(createUserTaskDto: CreateUserTaskDto, token: string): Promise<UserTask> {
    // Verifica se o usuário existe no controle-users-dev
    const userInfo = await this.authIntegrationService.checkToken(token);
    if (!userInfo) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const existingAssignment = await this.userTasksRepository.findByUserAndTask(
      createUserTaskDto.user_id,
      createUserTaskDto.task_id,
    );

    if (existingAssignment) {
      throw new ConflictException('Usuário já possui esta tarefa atribuída');
    }

    return this.userTasksRepository.create(createUserTaskDto);
  }

  async findAll(token: string): Promise<UserTask[]> {
    // Verifica se o usuário está autenticado
    const userInfo = await this.authIntegrationService.checkToken(token);
    if (!userInfo) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    return this.userTasksRepository.findAll({
      include: ['user', 'task'],
    });
  }

  async findOne(id: string, token: string): Promise<UserTask> {
    // Verifica se o usuário está autenticado
    const userInfo = await this.authIntegrationService.checkToken(token);
    if (!userInfo) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const userTask = await this.userTasksRepository.findOne(id, {
      include: ['user', 'task'],
    });
    if (!userTask) {
      throw new NotFoundException(`Tarefa do usuário com ID ${id} não encontrada`);
    }
    return userTask;
  }

  async findByUser(userId: string, token: string): Promise<UserTask[]> {
    // Verifica se o usuário está autenticado
    const userInfo = await this.authIntegrationService.checkToken(token);
    if (!userInfo) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    return this.userTasksRepository.findAll({
      where: { user_id: userId },
      include: ['task'],
    });
  }

  async update(id: string, updateUserTaskDto: UpdateUserTaskDto, token: string): Promise<UserTask> {
    // Verifica se o usuário está autenticado
    const userInfo = await this.authIntegrationService.checkToken(token);
    if (!userInfo) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const [affectedCount, affectedRows] = await this.userTasksRepository.update(
      id,
      updateUserTaskDto,
    );
    if (affectedCount === 0) {
      throw new NotFoundException(`Tarefa do usuário com ID ${id} não encontrada`);
    }
    return affectedRows[0];
  }

  async remove(id: string, token: string): Promise<void> {
    // Verifica se o usuário está autenticado
    const userInfo = await this.authIntegrationService.checkToken(token);
    if (!userInfo) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const affectedCount = await this.userTasksRepository.remove(id);
    if (affectedCount === 0) {
      throw new NotFoundException(`Tarefa do usuário com ID ${id} não encontrada`);
    }
  }

  async completeTask(id: string, token: string): Promise<UserTask> {
    // Verifica se o usuário está autenticado
    const userInfo = await this.authIntegrationService.checkToken(token);
    if (!userInfo) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const [affectedCount, affectedRows] = await this.userTasksRepository.update(id, {
      status: 'completed',
      completed_at: new Date().toISOString(),
    });
    if (affectedCount === 0) {
      throw new NotFoundException(`Tarefa do usuário com ID ${id} não encontrada`);
    }
    return affectedRows[0];
  }
} 