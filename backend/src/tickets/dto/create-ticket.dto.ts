import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({ example: 'Impressora não funciona' })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  titulo!: string;

  @ApiProperty({ example: 'A impressora do setor financeiro não liga desde ontem.' })
  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  descricao!: string;
}