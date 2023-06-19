
import { Injectable } from '@angular/core';
import { io,  Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Message } from './message.entity';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  public socket!: Socket;
  private API_URL = 'http://localhost:3000';//adicione o 'chat' nas que necessitarem
  
  constructor(private http: HttpClient) {}


  loginChat(id: number){
    this.socket = io(this.API_URL);
    console.log('Socket: ' + this.socket);
    this.socket.emit('loginChat', id);
  }

  logoutChat(id:number){
    this.socket = io(this.API_URL);
    this.socket.emit('logoutChat', id);
  }
  
  async sendMessage(message: Message){
    console.log('sendMessage-MessagesService');
    const url = `${this.API_URL}/chat`;
    this.http.post<Message>(url, message).subscribe(
      response => {
        // Lógica para lidar com a resposta do servidor, se necessário
        console.log('Post realizado com sucesso:', response);
      },
      error => {
        // Lógica para lidar com erros, se necessário
        console.error('Erro ao fazer o post:', error);
      }
    );
    
  }

  listenMessage(result: (message: Message) => void){ 
    this.socket.on('message', (data: Message) => {
      console.log(data);
      result(data)
    })
  }

 
  readMessagesFromServer(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.API_URL}/chat`);
  }
  
}

