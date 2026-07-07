import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'João' })
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Silva' })
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: 'info@gmail.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Please enter a valid email' })
  email?: string;

  @ApiPropertyOptional({ example: '123456' })
  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;
}
