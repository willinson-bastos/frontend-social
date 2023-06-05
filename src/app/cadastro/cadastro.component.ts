import { Component} from '@angular/core';
import{ FormBuilder, FormGroup, Validators} from '@angular/forms';
import { UsuarioCadastro } from '../usuario/usuario.cadastro'; 
import { UsuarioService } from '../usuario/usuario.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
 
  form:FormGroup;

  constructor(private formBuilder: FormBuilder,
     private usuarioService:UsuarioService,
     private router: Router){
      this.form = this.formBuilder.group({
        nome: ['', Validators.required],
        email: ['', Validators.required],
        senha: ['', Validators.required],
      });
  }


  onSubmit() {
    if (this.form.valid) {
      const { nome, email, senha } = this.form.value;
      const usuario : UsuarioCadastro = {
        nome: nome,
        email: email,
        senha: senha
      };

      console.log('Nome:', nome);
      console.log('Email:', email);
      console.log('Senha:', senha);

      this.usuarioService.createUsuario(usuario).subscribe(
        (response: any)=>{
          if (response.status === true)
          console.log('Cadastro realizado com sucesso!', response);
          Swal.fire({
            title: 'Sucesso!',
            text: 'Cadastro realizado com sucesso!',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#007bff', // Cor do botão de sucesso
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.value) {
              this.router.navigate(['']);
            }
          });
        },
        (error)=>{
          console.error('Erro ao efetuar cadasto.', error);
          Swal.fire({
            title: 'Falha no login',
            text: 'Cadastro inválido.',
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: '#007bff', // Cor do botão de sucesso
            confirmButtonText: 'OK',
          });
        }
      )
      
    }
  }
}
