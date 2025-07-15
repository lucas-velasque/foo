import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ description: 'Nome da tarefa' })
  @IsString()
  @IsNotEmpty()
  name: string = '';

  @ApiProperty({ description: 'Descrição da tarefa', required: false })
  @IsString()
  @IsOptional()
  description?: string;
} 