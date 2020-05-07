import { Queue } from 'bull';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AppGateway } from '../app.gateway';
import { Task } from './tasks.entity';
import { TaskStatus } from './task.status.enum';
import { User } from '../auth/user.entity';
import { InjectQueue } from '@nestjs/bull';
import { isValid } from './validation/validate';
import { CreateTaskDto } from './dto/create-task.dto';
import { validate } from './validator';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,

    @InjectQueue('EmailQueue')
    private emailQueue: Queue,

    private gateway: AppGateway,
  ) {}

  async getTasks(inputs) {
    const verifyedInput = await validate('get-task', inputs);
    return await this.taskRepository.getTasks(verifyedInput, inputs.user);
  }

  async getTaskById(id: string, user: User) {
    const found = await this.taskRepository.findOne({
      where: { uuid: id, userId: user.id },
    });

    if (!found) {
      throw new NotFoundException(`Error......Tasks ${id} Not Found`);
    }
    return found;
  }

  async createTask(inputs) {
    const { user } = inputs;
    const validateInput = await validate('create-task', inputs);
    const newTask = await this.taskRepository.createTask(validateInput, user);
    const job = await this.emailQueue.add('CreateTask', {
      email: user.username,
      title: validateInput.title,
      description: validateInput.description,
    });

    this.gateway.wss.emit('newTask', newTask);
    return newTask;
  }

  async deleteTask(id: string, user: User) {
    const result = await this.taskRepository.delete({
      uuid: id,
      userId: user.id,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Not Found');
    }
    return result;
  }

  async updateTaskStatus(id: string, status: TaskStatus, user: User) {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }
}
