import { PartialType } from '@nestjs/swagger';
import { CreateUserTaskDto } from './create-user-task.dto';
import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserTaskDto extends PartialType(CreateUserTaskDto) {
  @ApiPropertyOptional({ description: 'Data de conclusão da tarefa' })
  @IsOptional()
  @IsString()
  completed_at?: string;
} 