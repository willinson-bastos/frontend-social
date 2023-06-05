import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from './message.entity';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private socket: Socket;

  constructor(private socketIO: Socket) {
    this.socket = this.socketIO.ioSocket;
  }

  connect(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('message', (message: any) => {
        observer.next(message);
      });

      this.socket.on('connect_error', (error: any) => {
        observer.error(error);
      });
    });
  }

  send(message: Message): void {
    this.socket.emit('createMessage', message);
  }
}
