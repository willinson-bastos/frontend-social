import { Component, OnInit } from '@angular/core';
import { Post } from '../post/post';
import { PostCriar } from '../post/post.criar';
import { PostService } from '../post/post.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../usuario/usuario';
import { UsuarioService } from '../usuario/usuario.service';
import { UsuarioLogadoService } from '../usuario/usuario-logado.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  usuarioLogado!: Usuario;

  postForm: FormGroup;
  posts: Post[] = [];


  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private postService: PostService,
    private router: Router,
    private usuarioLogadoService: UsuarioLogadoService,
    private route: ActivatedRoute
    ) {
    this.postForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      conteudo: ['', Validators.required]
    });
  }


  ngOnInit(): void {
    /*this.route.queryParams.subscribe(params => {
      const email = params['email'];
      this.usuarioService.readOneUsuarioByEmail(email).subscribe(
        (usuario: Usuario) => {
          this.usuarioLogado = usuario;
        },
        (error) => {
          console.error('Erro ao buscar o usuário:', error);
        }
      );
    });*/
    //this.obterUsuarioLogado();
    const usuarioRefresh = localStorage.getItem('usuarioLogado');
    if(usuarioRefresh){
      this.usuarioLogado = JSON.parse(usuarioRefresh);
    }

    if(!this.usuarioLogado){
    this.usuarioLogado = this.usuarioLogadoService.getUsuarioLogado();
    console.log(this.usuarioLogado);
    }
    this.listarPosts();
  }

  /*obterUsuarioLogado(): void {
    console.log('obterUsuarioLogado');
    const emailLogado = this.usuarioLogadoService.getEmailUsuarioLogado();
    console.log('Email Logado: ', emailLogado);
    this.usuarioService.readOneUsuarioByEmail(emailLogado).subscribe(
      (usuario: Usuario) => {
        this.usuarioLogado = usuario;
      },
      (error) => {
        console.error('Erro ao buscar o usuário:', error);
      }
    );
  }*/

  async listarPosts(): Promise<void>{
    console.log('executado listar post');
    this.postService.readAllPosts().subscribe(
      (posts: Post[]) => {
        this.posts = posts;
      },
      (error) => {
        console.error('Erro ao carregar os posts:', error);
      }
    );
  }


  criarPost() {
    if(this.usuarioLogado){
    console.log('executado criar post',this.postForm);
    console.log('formulário válido? ',this.postForm.valid);
    if (this.postForm.valid) {
      console.log('entrou no: "if (this.form.valid)"');
      const { titulo, conteudo } = this.postForm.value;

      const data = new Date();
      const ano = data.getFullYear();
      const mes = ("0" + (data.getMonth() + 1)).slice(-2);  // Adiciona zero à esquerda se o número do mês tiver apenas um dígito
      const dia = ("0" + data.getDate()).slice(-2);  // Adiciona zero à esquerda se o número do dia tiver apenas um dígito
      const horas = ("0" + data.getHours()).slice(-2);  // Obtém as horas com zero à esquerda
      const minutos = ("0" + data.getMinutes()).slice(-2);  // Obtém os minutos com zero à esquerda

      const dataFormatada = `${dia}/${mes}/${ano} - ${horas}:${minutos}`;  // Cria a string no formato 

      console.log(dataFormatada);  // Exibe "dd/MM/yyyy hh:mm"


      const novoPost: PostCriar = {
        
        nomeUsuario: this.usuarioLogado.nome,
        emailUsuario: this.usuarioLogado.email,
        titulo: titulo,
        data: dataFormatada,
        texto: conteudo
      };

      console.log('novoPost:', novoPost);

      console.log('Título:', titulo);
      console.log('Texto:', conteudo);

      this.postService.createPost(novoPost).subscribe(
        (response: any) => {
          if (response.status === true)
            console.log('Postagem feita!', response);
          Swal.fire({
            title: 'Postagem realizada',
            text: '',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#007bff', 
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.value) {
              this.router.navigate(['home']);
            }
          });
        },
        (error) => {
          console.error('Erro ao efetuar postagem.', error);
          Swal.fire({
            title: 'Falha ao criar postagem',
            text: '',
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: '#007bff', 
            confirmButtonText: 'OK',
          });
        }
      )

      }
    }
  }

  async excluirPost(post: Post): Promise <void>{
    console.log('executado excluir post');


    this.postService.deletePost(post.id).subscribe(
      () => {   
        Swal.fire({
          title: 'Postagem excluída',
          text: '',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#007bff', 
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            this.router.navigate(['home']);
          }
        });
      },
      (error) => {
        console.error('Erro ao efetuar postagem.', error);
        Swal.fire({
          title: 'Falha ao criar postagem',
          text: '',
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#007bff', 
          confirmButtonText: 'OK',
        });
      }
    )
    
  }




}
