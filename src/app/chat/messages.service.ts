import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from './message.entity';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private socket: Socket;

  private API_URL = 'http://localhost:3000/chat';

  constructor(private socketIO: Socket,private http: HttpClient) {
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

  newMessageToServer(message: Message): Observable<Message> {
    //console.log('newMessageToServer executado');
    return this.http.post<Message>(this.API_URL, message);
  }

  readMessagesFromServer(): Observable<Message[]> {
    return this.http.get<Message[]>(this.API_URL);
  }

}

/*import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  constructor(private socket: Socket) {}

  receiveMessage$: Observable<any> = this.socket.fromEvent('message');

  sendMessage(roomId: string, userId: string, content: string): void {
    this.socket.emit('message', { roomId, userId, content });
  }

  createRoom(userId1: string, userId2: string): Observable<string> {
    return new Observable<string>(observer => {
      this.socket.emit('create-room', { userId1, userId2 }, (roomId: string) => {
        observer.next(roomId);
        observer.complete();
      });
    });
  }

  joinRoom(roomId: string, userId: string): void {
    this.socket.emit('join-room', { roomId, userId });
  }

  leaveRoom(roomId: string, userId: string): void {
    this.socket.emit('leave-room', { roomId, userId });
  }

  checkRoomExists(userId1: string, userId2: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.socket.emit('check-room-exists', { userId1, userId2 }, (exists: boolean) => {
        observer.next(exists);
        observer.complete();
      });
    });
  }
}
*/