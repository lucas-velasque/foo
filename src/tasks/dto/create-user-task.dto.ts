import { IsUUID, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserTaskDto {
  @ApiProperty({ description: 'ID do usuário' })
  @IsUUID()
  user_id: string = '';

  @ApiProperty({ description: 'ID da tarefa' })
  @IsUUID()
  task_id: string = '';

  @ApiProperty({ description: 'Status da tarefa', required: false })
  @IsString()
  @IsOptional()
  status?: string;
} 