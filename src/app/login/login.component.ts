import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../usuario/usuario.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioLogadoService } from '../usuario/usuario-logado.service';
import { Usuario } from '../usuario/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  form: FormGroup;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private usuarioLogadoService: UsuarioLogadoService
  ) {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  //  console.log('Email:', email);
  //  console.log('Senha:', password);
  onSubmit() {
    if (this.form.valid) {
      const { email, password } = this.form.value;

      console.log('Email:', email);
      console.log('Senha:', password);

      this.usuarioService.login(email, password).subscribe(
        (response: any) => {
          if (response.statusCode !== 401) {
            console.log('Login efetuado com sucesso!', response);

            const usuarioLogado: Usuario = response.user;  // Supondo que a resposta do serviço de login retorne o usuário logado
            console.log(usuarioLogado);
            this.usuarioLogadoService.setUsuarioLogado(usuarioLogado);            // Armazena o usuário logado no serviço
            localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado)); // Armazena o usuário logado no localStorage
 
            Swal.fire({
              title: 'Sucesso!',
              text: 'Login efetuado com sucesso!',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#007bff', // Cor do botão de sucesso
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.value) {
                this.router.navigate(['/home']);
              }
            });
            //this.router.navigate(['/home']);
          } else {
            console.error('Erro no login.');
            Swal.fire({
              title: 'Erro',
              text: 'Ocorreu um erro ao fazer o login.',
              icon: 'error',
              showCancelButton: false,
              confirmButtonColor: '#007bff', // Cor do botão de sucesso
              confirmButtonText: 'OK'
            });
          }
        },
        (error: any) => {
          if (error.status === 401) {
            console.error('Erro ao iniciar a sessão.', error);
            Swal.fire({
              title: 'Falha no login',
              text: 'Credenciais inválidas.',
              icon: 'error',
              showCancelButton: false,
              confirmButtonColor: '#007bff', // Cor do botão de sucesso
              confirmButtonText: 'OK',
            });

          }
        }
      );

    }


  }

}
