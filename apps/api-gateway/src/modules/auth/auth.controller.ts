import { Body, Controller, Get, Post, Request, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AuthResponseDto, JwtAuthGuard, LoginDto, RegisterDto } from '@app/common';
import { GatewayAuthService } from './auth.service';

@Controller('auth')
export class GatewayAuthController {
  constructor(private readonly gatewayAuthService: GatewayAuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    try {
      return await this.gatewayAuthService.register(registerDto);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    try {
      return await this.gatewayAuthService.login(loginDto);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: any) {
    return {
      message: 'You are authenticated via API Gateway!',
      user: req.user,
    };
  }
}
