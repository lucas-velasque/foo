import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './entities/task.entity';
import { UserTask } from './entities/user-task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksRepository } from './repositories/tasks.repository';
import { UserTasksController } from './user-tasks.controller';
import { UserTasksService } from './user-tasks.service';
import { UserTasksRepository } from './repositories/user-tasks.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Task, UserTask]),
    AuthModule,
  ],
  controllers: [TasksController, UserTasksController],
  providers: [
    TasksService,
    TasksRepository,
    UserTasksService,
    UserTasksRepository,
  ],
  exports: [TasksService, UserTasksService],
})
export class TasksModule {} 