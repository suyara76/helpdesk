import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TicketPriority } from '@prisma/client';

export class CreateTicketDto {
  @ApiProperty({ example: 'Impressora não funciona' })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  titulo!: string;

  @ApiProperty({ example: 'A impressora do setor financeiro não liga desde ontem.' })
  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  descricao!: string;

  @ApiPropertyOptional({ enum: TicketPriority, example: TicketPriority.MEDIUM })
  @IsOptional()
  @IsEnum(TicketPriority, { message: 'Invalid priority'})
  priority?: TicketPriority;
}