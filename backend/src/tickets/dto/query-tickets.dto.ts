import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsIn, IsInt, IsOptional, IsString, Min, isDateString } from 'class-validator';
import { TicketStatus } from '@prisma/client';
import { TicketPriority } from '@prisma/client';

export class QueryTicketsDto {
  @ApiPropertyOptional({ enum: TicketStatus })
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @ApiPropertyOptional({ description: 'Id of the user who created the ticket' })
  @IsOptional()
  @IsString()
  usuarioId?: string;

  @ApiPropertyOptional({ description: 'free text search in title and description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({description: 'Only tickets created on or after this date (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  createdAfter?: string;

  @ApiPropertyOptional({description: 'Only tickets created on or after this date (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  createdBefore?: string;

  @ApiPropertyOptional({ enum: ['createdAt', 'updatedAt', 'titulo', 'status'] })
  @IsOptional()
  @IsIn(['createdAt', 'updatedAt', 'titulo', 'status'])
  sortBy?: string = 'createdAt'; 

  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ enum: TicketPriority })
  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;
}