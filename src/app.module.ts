import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { APP_FILTER } from '@nestjs/core';
import { SentryModule } from '@sentry/nestjs/setup';
import { AuthModule } from './auth/auth.module';
import { SentryAllExceptionsFilter } from './commom/filters/sentry-all-exceptions.filter';
import databaseConfig from './config/database.config';
import { UrlsModule } from './urls/urls.module';
import { UsersModule } from './users/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import redisConfig from './config/redis.config';

@Module({
  imports: [
    SentryModule.forRoot(),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisConfig(),
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        autoLoadEntities: true,
        synchronize: process.env.NODE_ENV === 'development',
      }),
    }),
    UsersModule,
    AuthModule,
    UrlsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryAllExceptionsFilter,
    },
  ],
})
export class AppModule {}
