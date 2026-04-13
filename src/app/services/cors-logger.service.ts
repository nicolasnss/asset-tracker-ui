import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Serviço centralizado para logging de erros CORS e HTTP.
 * Fornece métodos para diagnosticar problemas de comunicação com o backend.
 */
@Injectable({
  providedIn: 'root',
})
export class CorsLoggerService {
  private readonly APP_ORIGIN = window.location.origin; // http://localhost:4200
  private readonly API_BASE_URL = 'http://localhost:8080/api';

  constructor() {
    this.logEnvironment();
  }

  /**
   * Loga informações do ambiente no carregamento da aplicação
   */
  private logEnvironment(): void {
    console.log('%c🚀 AMBIENTE DE EXECUÇÃO', 'color: blue; font-weight: bold; font-size: 14px');
    console.log({
      'App Origin': this.APP_ORIGIN,
      'API Base URL': this.API_BASE_URL,
      'Navegador': navigator.userAgent,
      'Timestamp': new Date().toISOString(),
    });
  }

  /**
   * Loga o início de uma requisição com detalhes CORS
   */
  logRequestStart(url: string, method: string, withCredentials: boolean): void {
    console.log(`%c📤 ${method} ${url}`, 'color: #2196F3; font-weight: bold;', {
      origin: this.APP_ORIGIN,
      withCredentials,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Loga sucesso de uma requisição
   */
  logRequestSuccess(url: string, status: number, data?: any): void {
    console.log(
      `%c✅ Sucesso: ${status} - ${url}`,
      'color: green; font-weight: bold;',
      {
        data: data?.slice ? `${data.slice(0, 100)}...` : data,
        timestamp: new Date().toISOString(),
      }
    );
  }

  /**
   * Loga erro de CORS bloqueio de rede (status 0)
   */
  logCorsNetworkBlocked(error: HttpErrorResponse): void {
    console.error(
      '%c🚫 ERRO: CORS BLOQUEIO DE REDE (status 0)',
      'color: red; font-weight: bold; font-size: 14px; background: #ffcccc;'
    );
    console.error('O navegador bloqueou a requisição. Possíveis causas:', {
      1: 'Backend não está respondendo ao CORS preflight',
      2: 'Credenciais não estão sendo enviadas (withCredentials != true)',
      3: 'Origin não está configurado no CORS do backend',
      4: 'Erro ao validar o certificado SSL (se HTTPS)',
    });
    this.logFullErrorDetails(error);
  }

  /**
   * Loga erro 403 Forbidden do Spring Security
   */
  logForbidden(error: HttpErrorResponse): void {
    console.error(
      '%c🔐 HTTP 403: PROIBIDO - Spring Security',
      'color: orange; font-weight: bold; font-size: 14px; background: #ffe0cc;'
    );
    console.error('Possíveis causas:', {
      1: 'Usuário não autenticado (sem Session/Token válido)',
      2: 'Usuário autenticado mas sem permissão para o recurso',
      3: 'CSRF token inválido (se aplicável)',
      4: 'Credenciais expiradas',
    });
    this.logFullErrorDetails(error);
  }

  /**
   * Loga erro genérico HTTP
   */
  logHttpError(error: HttpErrorResponse): void {
    console.error(
      `%c❌ HTTP ${error.status} - ${error.statusText}`,
      'color: red; font-weight: bold; font-size: 12px;'
    );
    this.logFullErrorDetails(error);
  }

  /**
   * Imprime todos os detalhes de erro HTTP
   */
  private logFullErrorDetails(error: HttpErrorResponse): void {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      'URL': error.url || 'unknown',
      'HTTP Status': error.status,
      'Status Text': error.statusText,
      'Error Message': error.message,
      'CORS Related': error.status === 0,
      'App Origin': this.APP_ORIGIN,
      'Error Type': error.status === 0 ? 'NETWORK_ERROR' : 'HTTP_ERROR',
      'Full Error Object': error,
      'Response Headers': this.extractHeaders(error),
      'Response Body': error.error,
    };

    console.table(errorInfo);
    console.error('Detalhes completos do erro:', error);
  }

  /**
   * Extrai headers da resposta para debugging
   */
  private extractHeaders(error: HttpErrorResponse): Record<string, string> {
    const headers: Record<string, string> = {};
    error.headers.keys().forEach((key) => {
      headers[key] = error.headers.get(key) || 'N/A';
    });
    return Object.keys(headers).length > 0 ? headers : { 'Nenhum header': 'disponível' };
  }

  /**
   * Loga recomendações de configuração CORS para o backend
   */
  logCorsConfiguration(): void {
    console.log(
      '%c📋 CONFIGURAÇÃO CORS ESPERADA NO BACKEND',
      'color: #009688; font-weight: bold; font-size: 14px; background: #e0f2f1;'
    );
    console.log(`
Spring Security CORS Configuration esperado:
=====================================
@Configuration
@EnableWebSecurity
public class CorsConfiguration extends WebSecurityConfigurerAdapter {
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.cors().and().csrf().disable()
        .authorizeRequests()
        .anyRequest().authenticated()
        .and()
        .httpBasic();
  }

  @Bean
  public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }
}
    `);
  }
}

