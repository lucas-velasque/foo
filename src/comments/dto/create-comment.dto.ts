import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Conteúdo do comentário',
    example: 'Este é um comentário de exemplo.',
    minLength: 1,
    maxLength: 1000,
  })
  @IsNotEmpty({ message: 'O conteúdo do comentário não pode estar vazio' })
  @IsString({ message: 'O conteúdo deve ser uma string' })
  @MinLength(1, { message: 'O comentário deve ter pelo menos 1 caractere' })
  @MaxLength(1000, { message: 'O comentário não pode ter mais de 1000 caracteres' })
  content!: string;
}

