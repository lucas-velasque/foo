import { IsNotEmpty, IsString, MaxLength, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSuggestionDto {
  @ApiProperty({ description: 'Conteúdo da sugestão de melhoria', maxLength: 1000 })
  @IsNotEmpty({ message: 'O conteúdo da sugestão não pode ser vazio.' })
  @IsString({ message: 'O conteúdo da sugestão deve ser uma string.' })
  @MaxLength(1000, { message: 'O conteúdo da sugestão não pode exceder 1000 caracteres.' })
  content!: string;

  @ApiProperty({ description: 'ID da propriedade (hotel) à qual a sugestão se refere' })
  @IsNotEmpty({ message: 'O ID da propriedade não pode ser vazio.' })
  @IsUUID('4', { message: 'O ID da propriedade deve ser um UUID válido.' })
  propertyId!: string;
}


