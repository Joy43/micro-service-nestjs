import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address of the user' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'password123', description: 'Password (at least 6 characters)' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;

  @ApiProperty({ example: ['HOST'], description: 'Roles assigned to the user (e.g. user, host, admin)', required: false })
  @IsOptional()
  @IsArray()
  roles?: string[];
}
