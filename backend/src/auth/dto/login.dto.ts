import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'info@gmail.com' })
  @IsEmail({}, { message: 'Please enter a valid email' })
  email: string;

  @ApiProperty({ example: '123456' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
