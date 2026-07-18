import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Client } from 'pg';

@Module({})
export class DatabaseModule {
  static register(schema: string = 'public'): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            if (schema && schema !== 'public') {
              const url = configService.get<string>('DATABASE_URL');
              if (url) {
                const client = new Client({ connectionString: url });
                try {
                  await client.connect();
                  await client.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
                } catch (err) {
                  console.error(`Failed to automatically create schema "${schema}":`, err);
                } finally {
                  await client.end().catch(() => {});
                }
              }
            }
            return {
              type: 'postgres',
              url: configService.get<string>('DATABASE_URL'),
              schema,
              autoLoadEntities: true,
              synchronize: configService.get<string>('NODE_ENV') !== 'production',
              logging: configService.get<string>('NODE_ENV') === 'development',
            };
          },
        }),
      ],
      exports: [TypeOrmModule],
    };
  }
}
