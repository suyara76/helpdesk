import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TicketStatus } from '@prisma/client';

export class UpdateTicketStatusDto {
  @ApiProperty({ enum: TicketStatus, example: TicketStatus.WORKING })
  @IsEnum(TicketStatus, { message: 'Invalid status' })
  status: TicketStatus;
}