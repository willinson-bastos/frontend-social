
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessagesService } from './messages.service';
import { Message } from './message.entity';
import { UsuarioLogadoService } from '../usuario/usuario-logado.service';
import { Usuario } from '../usuario/usuario';
import { UsuarioService } from '../usuario/usuario.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  usuarioLogado!: Usuario;
  
  messagesFromServer: Message[] =[];
  messages: Message[] = []; 
  newMessageContent: string = '';

  @ViewChild('chatBody') chatBody!: ElementRef;

  hasNewMessages: boolean = false;
  messageSenders: Set<number> = new Set<number>();


  listaDeUsuariosComMensagem: Usuario[] = [];
  listaDeUsuariosSemMensagem: Usuario[] = [];
  usuarioToastr!: Usuario | null;

  selectedUser!: Usuario ;

  showUserList: boolean = true;
  showConversaContainer: boolean = false;
  showChatBox: boolean = false;

  constructor(
    private messagesService: MessagesService,
    private usuarioLogadoService: UsuarioLogadoService,
    private usuarioService: UsuarioService,
    private toastr: ToastrService
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
    

    setTimeout(() => {
    this.login(this.usuarioLogado.id);
    }, 1000);
    
    
  }

  toggleChatBox(): void {
    this.showChatBox = !this.showChatBox;
  }

  async login(id:number){
    this.messagesService.loginChat(id);
    this.messagesService.listenMessage((message: Message) => {
      this.listServerMessages();
      
      if(this.selectedUser){
        if(message.idSender === this.selectedUser.id && message.idReceiver === this.usuarioLogado.id){
          this.messages.push(message);
        }
      } 
      if(message.idSender !== this.usuarioLogado.id && this.showChatBox === false){
        this.messageSenders.add(message.idSender);
        this.hasNewMessages = true;
        this.usuarioService.readOneUsuario(message.idSender).subscribe((usuario:Usuario)=>{
          this.usuarioToastr = usuario;
        });
        if(this.usuarioToastr)
        this.toastr.success("Nova mensagem de: " + this.usuarioToastr.nome );
        
        this.usuarioToastr = null;
      }

      this.updateChatColors();
    });
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
        this.updateChatColors();
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
  
  isMessageSender(userId: number): boolean {
    return this.messageSenders.has(userId);
  }

  async filterMessagesList(){
    this.messages = this.messagesFromServer.filter((message)=>
      (message.idSender === this.usuarioLogado.id && message.idReceiver === this.selectedUser.id) || (message.idSender === this.selectedUser.id && message.idReceiver === this.usuarioLogado.id)
    );
  }

  selectUser(usuario: Usuario): void {
    setTimeout(() => {
      this.listServerMessages();
    }, 0);
    
    
    this.selectedUser = usuario;
    console.log('selectUser'+ this.selectedUser.nome);

    
    if(!this.selectedUser) return ;

    if(this.messageSenders.has(this.selectedUser.id)){
      this.messageSenders.delete(this.selectedUser.id);
        if(this.messageSenders.size === 0){
          this.hasNewMessages = false;
        }
    }

    this.filterMessagesList();

    this.showUserList = false;
    this.showConversaContainer = true;
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);

  }

  listenMessages(){
    this.messagesService.listenMessage((message: Message) => {
      if(message.idSender === this.selectedUser.id && message.idReceiver === this.usuarioLogado.id){
        this.messages.push(message);

        setTimeout(() => {
          this.scrollToBottom();
        }, 0);

      }
      this.updateChatColors();
    });
  }
  

  sendMessage(newMessageContent: string): void {
    this.newMessageContent = newMessageContent;
    if (!this.newMessageContent) {
      return;
    }

    if (this.newMessageContent) {

      const data = new Date();
      const horas = ("0" + data.getHours()).slice(-2);  // Obtém as horas com zero à esquerda
      const minutos = ("0" + data.getMinutes()).slice(-2);  // Obtém os minutos com zero à esquerda

      const dataFormatada = `(${horas}:${minutos})`;  // Cria a string no formato 

      const message: Message = {
        idSender: this.usuarioLogado.id,
        idReceiver: this.selectedUser.id,
        text: ("["+this.usuarioLogado.nome +"]"+dataFormatada + ": " + this.newMessageContent)
      };

      this.messages.push(message);
      this.messagesService.sendMessage(message);

      this.newMessageContent = '';
      setTimeout(() => {
        this.scrollToBottom();
      }, 0);
    }
  }

  async scrollToBottom(){
    const chatBodyElement = this.chatBody.nativeElement;
    chatBodyElement.scrollTop = chatBodyElement.scrollHeight;
  }

  goBackToList(): void {
    this.listServerUsers();
    this.listServerMessages();
    this.showUserList = true;
    this.showConversaContainer = false;
    this.messages = [];
  }

  private updateChatColors(): void {
    // Verifica se há novas mensagens não lidas
    if (this.hasNewMessages) {
      // Altera a cor do ícone do chat para indicar a presença de novas mensagens
      const chatBubbleElement = document.querySelector('.chat-bubble') as HTMLElement;
      if (chatBubbleElement) {
        chatBubbleElement.classList.add('chat-icon-new-messages');
      }
    } else {
      // Remove a cor do ícone do chat quando não há novas mensagens
      const chatBubbleElement = document.querySelector('.chat-bubble') as HTMLElement;
      if (chatBubbleElement) {
        chatBubbleElement.classList.remove('chat-icon-new-messages');
      }
    }
  
    // Altera a cor de fundo dos usuários que enviaram mensagens
    const userListElements = document.querySelectorAll('.user');
    if (userListElements) {
      userListElements.forEach((element) => {
        const userId = Number((element as HTMLElement).dataset['userId']);
        if (userId && this.messageSenders.has(userId)) {
          element.classList.add('user-message-sender');
        } else {
          element.classList.remove('user-message-sender');
        }
      });
    }
  }
  
  
  
  
}


