import { IsNotEmpty, IsUUID, IsNumber, Min, IsOptional, IsEnum } from 'class-validator';

export enum BookingStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export class CreateBookingDto {
  @IsNotEmpty({ message: 'property_id é obrigatório' })
  @IsUUID('4', { message: 'property_id deve ser um UUID válido' })
  property_id: string = '';

  @IsNotEmpty({ message: 'number_of_days é obrigatório' })
  @IsNumber({}, { message: 'number_of_days deve ser um número' })
  @Min(1, { message: 'number_of_days deve ser pelo menos 1' })
  number_of_days: number = 1;

  @IsOptional()
  @IsNumber({}, { message: 'work_hours_offered deve ser um número' })
  @Min(1, { message: 'work_hours_offered deve ser pelo menos 1' })
  work_hours_offered?: number = 4; // Opcional, valor padrão 4

  guest_id?: string; // será setado no serviço

  @IsOptional()
  @IsEnum(BookingStatus, { message: 'status deve ser um valor válido' })
  status?: BookingStatus;  // status opcional no DTO, mas com enum para validação
}
