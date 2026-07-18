import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KAFKA_BROKER, KAFKA_CLIENT_ID, KAFKA_CONSUMER_GROUP } from './constant/kafka.constants';


export const KAFKA_SERVICE = 'KAFKA_SERVICE';

@Module({})
export class KafkaModule {
  static register(consumerGroup?: string): DynamicModule {
    return {
      module: KafkaModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: KAFKA_SERVICE,
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
              transport: Transport.KAFKA,
              options: {
                client: {
                  clientId: KAFKA_CLIENT_ID,
                  brokers: [configService.get<string>('KAFKA_BROKER') ?? KAFKA_BROKER],
                },
                consumer: {
                  groupId: consumerGroup ?? KAFKA_CONSUMER_GROUP,
                },
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}