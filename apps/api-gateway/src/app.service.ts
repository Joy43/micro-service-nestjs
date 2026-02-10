import { SERVICE_PORTS } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Hello Api Gateway running port ${SERVICE_PORTS.API_GATEWAY}!`;
  }
}
