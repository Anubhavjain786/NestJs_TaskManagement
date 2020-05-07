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
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status.validation.pipe';
import { Task } from './tasks.entity';
import { TaskStatus } from './task.status.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { GetAllInputs } from '../middleware/all-inputes.middleware';
import { getValidation } from './validation/getValidation';
import { FileInterceptor } from '@nestjs/platform-express';
import { transform } from './transform';
import { Body } from '@nestjs/common';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(private taskService: TasksService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getTasks(
    @Query(ValidationPipe) filterDto: GetTaskFilterDto,
    @GetUser() user: User,
  ) {
    this.logger.verbose(
      `User "${user.username}" retriving all tasks. Filters: ${JSON.stringify(
        filterDto,
      )}`,
    );
    let result = await this.taskService.getTasks(
      filterDto,
      // getValidation(inputs, 'getTasks'),
      user,
    );
    return { status: 'success', data: transform(result) };
  }

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async getTaskById(@Param('id') id: string, @GetUser() user: User) {
    let result = await this.taskService.getTaskById(id, user);
    return { status: 'success', data: transform(result) };
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createNewTask(
    @GetAllInputs() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ) {
    this.logger.verbose(
      `user "${user.username}" creating a new task. Data: ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    let result = await this.taskService.createTask(createTaskDto, user);
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
