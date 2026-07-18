import { ApiProperty } from '@nestjs/swagger';
import { IUser } from '../../interface/user.interface';

export class AuthResponseDto {
  @ApiProperty({
    description: 'User details (without password)',
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'John Doe',
      email: 'john.doe@example.com',
      roles: ['user'],
      createdAt: '2026-07-19T01:00:00.000Z',
      updatedAt: '2026-07-19T01:00:00.000Z',
    },
  })
  user!: Omit<IUser, 'password'>;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT Access Token',
  })
  accessToken!: string;
}
