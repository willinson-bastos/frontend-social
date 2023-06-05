import { Injectable } from '@angular/core';
import{HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';
import { Usuario } from './usuario';
import { UsuarioCadastro } from './usuario.cadastro';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private API_URL = 'http://localhost:3000/usuario'

  constructor(private http: HttpClient) { }

  createUsuario(usuario: UsuarioCadastro): Observable<Usuario> {
    return this.http.post<Usuario>(this.API_URL, usuario);
  }

  readAllUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.API_URL}/listar`);
  }

  readOneUsuario(id: number): Observable<Usuario> {
    const url = `${this.API_URL}/${id}`;
    return this.http.get<Usuario>(url);
  }
  
  readOneUsuarioByEmail(email:string):Observable<Usuario>{
    const url = `${this.API_URL}?email=${encodeURIComponent(email)}`;
    return this.http.get<Usuario>(url);
  }

  updateUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    const url = `${this.API_URL}/${id}`;
    return this.http.put<Usuario>(url, usuario);
  }

  deleteUsuario(id: number): Observable<void> {
    const url = `${this.API_URL}/${id}`;
    return this.http.delete<void>(url);
  }

  login(email: string, password: string): Observable<any> {
    const url = `${this.API_URL}/login`;
    const payload = { email, password };
    return this.http.post<any>(url, payload);
  }

}