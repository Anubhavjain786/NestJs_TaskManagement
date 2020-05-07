import { Processor } from '@nestjs/bull';

@Processor('EmailQueue')
export class EmailConsumer {}
