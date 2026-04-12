import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import type { NotificationEvent } from './constants/notification-event.constants';

@Injectable()
export class NotificationsService {
  private server: Server | null = null;

  setServer(server: Server): void {
    this.server = server;
  }

  emitToUser(userId: string, event: NotificationEvent, payload: unknown): void {
    if (!this.server) {
      return;
    }
    this.server.to(`user:${userId}`).emit(event, payload);
  }
}
