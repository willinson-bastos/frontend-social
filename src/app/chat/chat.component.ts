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
  nome: string = ''; 
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
    }

    this.listServerMessages();

    this.messagesService.connect().subscribe((message: Message) => {
      this.messages.push(message);
    });
  
  }

  toggleChatBox(): void {
    this.showChatBox = !this.showChatBox;
  }

  async listServerMessages(): Promise<void>{
    this.messagesService.readMessagesFromServer().subscribe(
      (messages: Message[]) => {
        this.messages = messages;
      },
      (error) => {
        console.error('Erro ao carregar as mensagens:', error);
      }
    );
  }
 
  sendMessage(content: string): void {
    
    const message: Message = {
      name: this.usuarioLogado.nome,
      text: content
    };
  
    if(message.text){
      this.messagesService.newMessageToServer(message).subscribe(
        (response: Message) => {
          // Lógica a ser executada quando a resposta do servidor for recebida
          console.log('Resposta do servidor:', response);
          // Outras ações, se necessário
        },
        (error) => {
          // Lógica a ser executada em caso de erro
          console.error('Erro ao enviar mensagem para o servidor:', error);
        }
      );
      this.messagesService.send(message);
      this.newMessageContent = ''; // Limpar o conteúdo do campo de mensagem
    }
  }
  
}


/*import { Component, OnInit } from '@angular/core';
import { MessagesService } from './messages.service';
import { Message } from './message.entity';
import { UsuarioLogadoService } from '../usuario/usuario-logado.service';
import { Usuario } from '../usuario/usuario';
import { UsuarioService } from '../usuario/usuario.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];

  newMessageContent: string = '';
  createdRoomId: string = '';

  listaDeUsuarios: Usuario[] = [];

  usuarioLogado!: Usuario;
  selectedUser!: Usuario ;

  showUserList: boolean = true;
  showConversaContainer: boolean = false;
  showChatBox: boolean = false;

  constructor(
    private messagesService: MessagesService,
    private usuarioLogadoService: UsuarioLogadoService,
    private usuarioService: UsuarioService,
    private socket: Socket
  ) {}

  ngOnInit(): void {
    this.usuarioService.readAllUsuarios().subscribe((usuarios: Usuario[]) => {
      this.listaDeUsuarios = usuarios.filter(user => user.id !== this.usuarioLogado.id);
    });

    const usuarioRefresh = localStorage.getItem('usuarioLogado');
    if (usuarioRefresh) {
      this.usuarioLogado = JSON.parse(usuarioRefresh);
    }

    if (!this.usuarioLogado) {
      this.usuarioLogado = this.usuarioLogadoService.getUsuarioLogado();
      console.log(this.usuarioLogado);
    }

    this.messagesService.receiveMessage$.subscribe((message: Message) => {
      this.messages.push(message);
    });
  }

  toggleChatBox(): void {
    this.showChatBox = !this.showChatBox;
  }

  selectUser(usuario: Usuario): void {
    this.selectedUser = usuario;
    this.showUserList = false;
    this.showConversaContainer = true;
  
    // Verificação de usuário logado e sala existente
    if (this.selectedUser && this.createdRoomId) {
      this.messagesService.leaveRoom(this.createdRoomId, this.usuarioLogado.id.toString());
    }
  
    if (this.selectedUser?.id) { // Usando o operador de navegação segura (?)
      // Verifique se a sala já existe
      this.messagesService
        .checkRoomExists(this.usuarioLogado.id.toString(), this.selectedUser.id.toString())
        .subscribe((roomExists) => {
          if (roomExists) {
            // A sala já existe, então apenas junte-se a ela
            this.messagesService.joinRoom(this.createdRoomId, this.usuarioLogado.id.toString());
          } else {
            // A sala não existe, crie uma nova sala e junte-se a ela
            this.messagesService
              .createRoom(this.usuarioLogado.id.toString(), this.selectedUser.id.toString())
              .subscribe((roomId: string) => {
                this.createdRoomId = roomId;
                this.messagesService.joinRoom(this.createdRoomId, this.usuarioLogado.id.toString());
              });
          }
        });
    }
  }
  
  

  sendMessage(newMessageContent: string): void {
    this.newMessageContent = newMessageContent;
    if (!this.newMessageContent) {
      return;
    }

    if (this.createdRoomId) {
      const message: Message = {
        roomId: this.createdRoomId,
        name: this.usuarioLogado.id.toString(),
        text: this.newMessageContent
      };

      this.messages.push(message);

      this.messagesService.sendMessage(this.createdRoomId, this.usuarioLogado.id.toString(), this.newMessageContent);

      this.newMessageContent = '';
    }
  }

  goBackToList(): void {
    this.showUserList = true;
    this.showConversaContainer = false;

    if (this.createdRoomId) {
      this.messagesService.leaveRoom(this.createdRoomId, this.usuarioLogado.id.toString());
    }

    this.createdRoomId = '';
    this.messages = [];
  }
}*/
