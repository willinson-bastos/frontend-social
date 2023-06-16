
import { Component, OnInit } from '@angular/core';
import { MessagesService } from './messages.service';
import { Message } from './message.entity';
import { UsuarioLogadoService } from '../usuario/usuario-logado.service';
import { Usuario } from '../usuario/usuario';
import { UsuarioService } from '../usuario/usuario.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  usuarioLogado!: Usuario;
  
  messagesFromServer: Message[] =[];//usar na lista do servidor
  messages: Message[] = []; //filtrar as mensagens desejadas
  newMessageContent: string = '';


  listaDeUsuariosComMensagem: Usuario[] = [];
  listaDeUsuariosSemMensagem: Usuario[] = [];

  selectedUser!: Usuario ;

  showUserList: boolean = true;
  showConversaContainer: boolean = false;
  showChatBox: boolean = false;

  constructor(
    private messagesService: MessagesService,
    private usuarioLogadoService: UsuarioLogadoService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    
    const usuarioRefresh = localStorage.getItem('usuarioLogado');
    if (usuarioRefresh) {
      this.usuarioLogado = JSON.parse(usuarioRefresh);
    }

    if (!this.usuarioLogado) {
      this.usuarioLogado = this.usuarioLogadoService.getUsuarioLogado();
      console.log(this.usuarioLogado);
    }

    this.listServerMessages();
    this.listServerUsers();
    
    this.messagesService.loginChat(this.usuarioLogado.id);
    
  }

  toggleChatBox(): void {
    this.showChatBox = !this.showChatBox;
  }

  async listServerUsers(){
    this.usuarioService.readAllUsuarios().subscribe((usuarios: Usuario[]) => {
      this.listaDeUsuariosComMensagem = usuarios.filter(user => user.id !== this.usuarioLogado.id && this.hasMessages(user));
      this.listaDeUsuariosSemMensagem = usuarios.filter(user => user.id !== this.usuarioLogado.id && !this.hasMessages(user));
    });
  }

  async listServerMessages(): Promise<void>{
    console.log('listServerMessages');
    this.messagesService.readMessagesFromServer().subscribe(
      (messages: Message[]) => {
        this.messagesFromServer = messages;
      },
      (error) => {
        console.error('Erro ao carregar as mensagens:', error);
      }
    );
  }

  hasMessages(user: Usuario): boolean {
    const hasMessages = this.messagesFromServer.some(message =>
      (message.idSender === this.usuarioLogado.id && message.idReceiver === user.id) ||
      (message.idSender === user.id && message.idReceiver === this.usuarioLogado.id)
    );
    return hasMessages;
  }
  

  async filterMessagesList(){
    this.messages = this.messagesFromServer.filter((message)=>
      (message.idSender === this.usuarioLogado.id && message.idReceiver === this.selectedUser.id) || (message.idSender === this.selectedUser.id && message.idReceiver === this.usuarioLogado.id)
    );
  }

  selectUser(usuario: Usuario): void {
    
    this.selectedUser = usuario;
    console.log('selectUser'+ this.selectedUser.nome);
    
    if(!this.selectedUser) return ;

    //chamar método para filtrar as mensagens (messagesFromServer => messages)
    this.filterMessagesList();

    this.showUserList = false;
    this.showConversaContainer = true;

    this.listenMessages();
   
  }

  listenMessages(){
    this.messagesService.listenMessage((message: Message) => {
      if(message.idSender === this.selectedUser.id && message.idReceiver === this.usuarioLogado.id){
        this.messages.push(message);
        }

    });
  }
  

  sendMessage(newMessageContent: string): void {
    this.newMessageContent = newMessageContent;
    if (!this.newMessageContent) {
      return;
    }

    if (this.newMessageContent) {
      const message: Message = {
        idSender: this.usuarioLogado.id,
        idReceiver: this.selectedUser.id,
        text: ("["+ this.usuarioLogado.nome +"]: "+this.newMessageContent)
      };

      this.messages.push(message);
      this.messagesService.sendMessage(message);

      this.newMessageContent = '';
    }
  }

  goBackToList(): void {
    this.showUserList = true;
    this.showConversaContainer = false;
    this.messages = [];
  }
}



/*import { Component, OnInit } from '@angular/core';
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
          //console.log('Resposta do servidor:', response);
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
*/

