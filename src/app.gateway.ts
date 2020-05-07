import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

@WebSocketGateway(3001)
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger('AppGateway');

  @WebSocketServer()
  wss;

  handleConnection(clients) {
    this.logger.log('New Client Connected');
    clients.emit('connection', 'Successfully connected to server');
  }

  handleDisconnect() {
    this.logger.warn('client Left the application');
  }
}
