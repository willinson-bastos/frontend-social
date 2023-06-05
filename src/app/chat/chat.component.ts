import { Component, OnInit } from '@angular/core';
import { MessagesService } from './messages.service';
import { Message } from './message.entity';
import { UsuarioLogadoService } from '../usuario/usuario-logado.service';
import { Usuario } from '../usuario/usuario';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  usuarioLogado!: Usuario;

  showChatBox: boolean = false;
  messages: Message[] = [];
  nome: string = 'Usuário Logado'; 
  newMessageContent: string = '';

  constructor(private messagesService: MessagesService,
    private usuarioLogadoService: UsuarioLogadoService
    ) {}

  ngOnInit(): void {

    const usuarioRefresh = localStorage.getItem('usuarioLogado');
    if(usuarioRefresh){
      this.usuarioLogado = JSON.parse(usuarioRefresh);
    }

    if(!this.usuarioLogado){
    this.usuarioLogado = this.usuarioLogadoService.getUsuarioLogado();
    console.log(this.usuarioLogado);
    }

    this.messagesService.connect().subscribe((message: Message) => {
      this.messages.push(message);
    });


  }

  toggleChatBox(): void {
    this.showChatBox = !this.showChatBox;
  }

  sendMessage(content: string): void {
    const message: Message = {
      name: this.usuarioLogado.nome,
      text: content
    };

    this.messagesService.send(message);
  }
}
