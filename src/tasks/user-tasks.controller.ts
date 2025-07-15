import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { UserTasksService } from './user-tasks.service';
import { CreateUserTaskDto } from './dto/create-user-task.dto';
import { UpdateUserTaskDto } from './dto/update-user-task.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('user-tasks')
@Controller('user-tasks')
@UseGuards(JwtAuthGuard, RolesGuard, AuthGuard)
export class UserTasksController {
  constructor(private readonly userTasksService: UserTasksService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Assign a task to a user' })
  @ApiResponse({ status: 201, description: 'Task successfully assigned.' })
  create(@Body() createUserTaskDto: CreateUserTaskDto, @Req() req: any) {
    return this.userTasksService.create(createUserTaskDto, req.headers.authorization.split(' ')[1]);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all task assignments' })
  @ApiResponse({ status: 200, description: 'Return all task assignments.' })
  findAll(@Req() req: any) {
    return this.userTasksService.findAll(req.headers.authorization.split(' ')[1]);
  }

  @Get('my-tasks')
  @ApiOperation({ summary: 'Get current user tasks' })
  @ApiResponse({ status: 200, description: 'Return user tasks.' })
  findMyTasks(@Req() req: any) {
    return this.userTasksService.findByUser(req.user.id, req.headers.authorization.split(' ')[1]);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task assignment by id' })
  @ApiResponse({ status: 200, description: 'Return the task assignment.' })
  @ApiResponse({ status: 404, description: 'Task assignment not found.' })
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.userTasksService.findOne(id, req.headers.authorization.split(' ')[1]);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a task assignment' })
  @ApiResponse({ status: 200, description: 'Task assignment successfully updated.' })
  @ApiResponse({ status: 404, description: 'Task assignment not found.' })
  update(
    @Param('id') id: string,
    @Body() updateUserTaskDto: UpdateUserTaskDto,
    @Req() req: any,
  ) {
    return this.userTasksService.update(id, updateUserTaskDto, req.headers.authorization.split(' ')[1]);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Mark a task as completed' })
  @ApiResponse({ status: 200, description: 'Task successfully marked as completed.' })
  @ApiResponse({ status: 404, description: 'Task assignment not found.' })
  completeTask(@Param('id') id: string, @Req() req: any) {
    return this.userTasksService.completeTask(id, req.headers.authorization.split(' ')[1]);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remove a task assignment' })
  @ApiResponse({ status: 200, description: 'Task assignment successfully removed.' })
  @ApiResponse({ status: 404, description: 'Task assignment not found.' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.userTasksService.remove(id, req.headers.authorization.split(' ')[1]);
  }
} 