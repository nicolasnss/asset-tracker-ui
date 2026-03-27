import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api'; // URL do seu Spring Boot

  constructor(private http: HttpClient) {}

  // Método para testar a conexão com o usuário que criamos no banco
  testarLogin(login: string, senha: string): Observable<any> {
    // Criamos o header de autenticação básica (Basic Auth)
    const headers = new HttpHeaders({
      authorization: 'Basic ' + btoa(login + ':' + senha),
    });

    return this.http.get(`${this.apiUrl}/assets/dashboard`, { headers });
  }

  // Método para listar ativos
  listarAtivos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/assets`);
  }

  // Método para salvar um novo ativo
  salvarAtivo(asset: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/assets`, asset);
  }

  // Método para atualizar um ativo existente
  atualizarAtivo(id: number, asset: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/assets/${id}`, asset);
  }

  // Método para excluir um ativo
  excluirAtivo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/assets/${id}`);
  }
}
