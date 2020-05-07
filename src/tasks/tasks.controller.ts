import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Patch,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  Logger,
  UseInterceptors,
  UploadedFile,
  ClassSerializerInterceptor,
  Query,
  UseFilters,
  Body,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatusValidationPipe } from './pipes/task-status.validation.pipe';
import { TaskStatus } from './task.status.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { GetAllInputs } from '../middleware/all-inputes.middleware';
import { getValidation } from './validation/getValidation';
import { FileInterceptor } from '@nestjs/platform-express';
import { transform } from './transform';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(private taskService: TasksService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getTasks(@GetAllInputs() inputs) {
    const { search, status, user } = inputs;
    this.logger.verbose(
      `User "${user.username}" retriving all tasks. Filters: ${JSON.stringify(
        inputs,
      )}`,
    );
    let result = await this.taskService.getTasks({ search, status, user });
    return { status: 'success', data: transform(result) };
  }

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async getTaskById(@Param('id') id: string, @GetUser() user: User) {
    let result = await this.taskService.getTaskById(id, user);
    return { status: 'success', data: transform(result) };
  }

  @Post()
  async createNewTask(@GetAllInputs() inputs) {
    const { title, description, user } = inputs;
    this.logger.verbose(
      `user "${user.username}" creating a new task. Data: ${JSON.stringify(
        inputs,
      )}`,
    );
    let result = await this.taskService.createTask({
      title,
      description,
      user,
    });
    return { status: 'success', data: transform(result) };
  }

  @Post('/banner')
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(@UploadedFile() file) {
    console.log(file);
  }

  @Delete('/:id')
  async deleteTask(@Param('id') id: string, @GetUser() user: User) {
    let result = await this.taskService.deleteTask(id, user);
    return { status: 'success', data: transform(result) };
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ) {
    let result = await this.taskService.updateTaskStatus(id, status, user);
    return { status: 'success', data: result };
  }
}
