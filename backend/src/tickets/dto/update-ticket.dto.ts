import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTicketDto {
  @ApiPropertyOptional({ example: 'Impressora não funciona' })
  @IsOptional()
  @IsString()
  titulo?: string;

  @ApiPropertyOptional({ example: 'Descrição atualizada do problema.' })
  @IsOptional()
  @IsString()
  descricao?: string;
}