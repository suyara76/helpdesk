import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'João' })
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiProperty({ example: 'Silva' })
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @ApiProperty({ example: 'info@gmail.com' })
  @IsEmail({}, { message: 'Please enter a valid email' })
  email: string;

  @ApiProperty({ example: '123456' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
