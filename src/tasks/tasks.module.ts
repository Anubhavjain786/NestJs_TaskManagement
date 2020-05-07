import { Module } from '@nestjs/common';
import { AppGateway } from '../app.gateway';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { AuthModule } from 'src/auth/auth.module';
import { BullModule } from '@nestjs/bull';
import { MulterModule } from '@nestjs/platform-express';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '../interceptors/http/exception.filter';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskRepository]),
    AuthModule,
    BullModule.registerQueue({
      name: 'EmailQueue',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [TasksController],
  providers: [
    TasksService,
    AppGateway,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class TasksModule {}
