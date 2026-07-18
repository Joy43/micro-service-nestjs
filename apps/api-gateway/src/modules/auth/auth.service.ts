import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AuthResponseDto, LoginDto, RegisterDto, SERVICE_PORTS } from '@app/common';
import { KAFKA_SERVICE } from '@app/kafka';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GatewayAuthService implements OnModuleInit {
  private authServiceUrl: string;

  constructor(
    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
    private readonly configService: ConfigService,
  ) {
    const authPort = this.configService.get<number>('AUTH_SERVICE_PORT') ?? SERVICE_PORTS.AUTH_SERVICE;
    this.authServiceUrl = `http://localhost:${authPort}`;
  }

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('auth.register');
    this.kafkaClient.subscribeToResponseOf('auth.login');
    await this.kafkaClient.connect();
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    try {
      const response = await fetch(`${this.authServiceUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerDto),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || 'Registration failed');
      }
      return (await response.json()) as AuthResponseDto;
    } catch (err: any) {
      throw new Error(`Failed to register via Auth Service: ${err.message}`);
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    try {
      const response = await fetch(`${this.authServiceUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginDto),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || 'Login failed');
      }
      return (await response.json()) as AuthResponseDto;
    } catch (err: any) {
      throw new Error(`Failed to login via Auth Service: ${err.message}`);
    }
  }
}
