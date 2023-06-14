import { Injectable } from '@angular/core';
import { Usuario } from '../usuario/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioLogadoService {
  private usuarioLogado!: Usuario;

  setUsuarioLogado(usuario: Usuario): void {
    //console.log('setUsuarioLogado');
    this.usuarioLogado = usuario;
  }

  getUsuarioLogado(): Usuario {
    //console.log('getUsuarioLogado');
    return this.usuarioLogado;
  }
}