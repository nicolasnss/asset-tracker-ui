import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Interface para estatísticas do dashboard
 */
export interface DashboardStats {
  total_ativos: number;
  disponivel: number;
  em_uso: number;
}

/**
 * Interface para dados de funcionário
 */
export interface Funcionario {
  id: number;
  nome: string;
}

/**
 * Serviço de autenticação e gerenciamento de ativos.
 *
 * NOTA IMPORTANTE: Todas as requisições HTTP para localhost:8080 incluem
 * automaticamente withCredentials: true via HttpCredentialsInterceptor.
 * Não é necessário adicionar manualmente em cada chamada.
 *
 * @see HttpCredentialsInterceptor
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * URL base da API do backend Spring Boot.
   * Sem barra no final para evitar duplicação ao concatenar com rotas.
   */
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  /**
   * Obtém estatísticas do dashboard (total de ativos, disponíveis, em uso)
   *
   * @returns Observable<DashboardStats> - Estatísticas do dashboard
   */
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/assets/dashboard`);
  }

  /**
   * Obtém lista de todos os funcionários
   *
   * @returns Observable<Funcionario[]> - Lista de funcionários
   */
  getFuncionarios(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(`${this.apiUrl}/funcionarios`);
  }

  /**
   * Testa a conexão com o backend usando autenticação básica (Basic Auth)
   *
   * @param login - Nome de usuário
   * @param senha - Senha do usuário
   * @returns Observable<any> - Resposta do servidor
   */
  testarLogin(login: string, senha: string): Observable<any> {
    // Criar header de autenticação básica (Basic Auth)
    const headers = new HttpHeaders({
      authorization: 'Basic ' + btoa(login + ':' + senha),
    });

    return this.http.get(`${this.apiUrl}/assets/dashboard`, { headers });
  }

  /**
   * Lista todos os ativos do sistema
   *
   * @returns Observable<any> - Lista paginada de ativos
   */
  listarAtivos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/assets`);
  }

  /**
   * Cria um novo ativo no sistema
   *
   * @param asset - Dados do ativo a ser criado
   * @returns Observable<any> - Ativo criado com ID gerado
   */
  salvarAtivo(asset: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/assets`, asset);
  }

  /**
   * Atualiza um ativo existente
   *
   * @param id - ID do ativo a ser atualizado
   * @param asset - Novos dados do ativo
   * @returns Observable<any> - Ativo atualizado
   */
  atualizarAtivo(id: number, asset: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/assets/${id}`, asset);
  }

  /**
   * Exclui um ativo do sistema
   *
   * @param id - ID do ativo a ser excluído
   * @returns Observable<any> - Confirmação de exclusão
   */
  excluirAtivo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/assets/${id}`);
  }
}
