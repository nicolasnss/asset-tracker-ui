import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CorsLoggerService } from './cors-logger.service';

/**
 * Interceptor global para adicionar withCredentials: true em todas as requisições HTTP.
 * Necessário para o Spring Security com CORS permitir credentials.
 *
 * Recursos:
 * - Adiciona automaticamente withCredentials: true para requisições a localhost:8080
 * - Registra o Origin esperado (http://localhost:4200)
 * - Captura e registra detalhes completos de erros HTTP
 * - Diferencia entre bloqueios CORS (status 0), proibições (403) e outros erros
 * - Usa CorsLoggerService para logs estruturados
 */
@Injectable()
export class HttpCredentialsInterceptor implements HttpInterceptor {
  private readonly API_BASE_URL = 'http://localhost:8080';
  private readonly APP_ORIGIN = 'http://localhost:4200'; // Sem barra no final

  constructor(private corsLogger: CorsLoggerService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Verificar se a requisição é para o backend esperado
    const isLocalBackendRequest = request.url.startsWith(this.API_BASE_URL);

    if (isLocalBackendRequest) {
      // Logar início da requisição
      this.corsLogger.logRequestStart(
        request.url,
        request.method,
        true // withCredentials
      );

      // Clonar a requisição e adicionar withCredentials
      const credentialRequest = request.clone({
        withCredentials: true,
      });

      // Processar a requisição e capturar respostas/erros
      return next.handle(credentialRequest).pipe(
        tap((event: HttpEvent<unknown>) => {
          // Logar sucesso quando a resposta completa chegar
          if (event instanceof HttpResponse) {
            this.corsLogger.logRequestSuccess(
              request.url,
              event.status,
              event.body
            );
          }
        }),
        catchError((error: HttpErrorResponse) => {
          // Classificar e logar o erro
          if (error.status === 0) {
            // Bloqueio de CORS ou erro de rede
            this.corsLogger.logCorsNetworkBlocked(error);
          } else if (error.status === 403) {
            // Forbidden - Spring Security recusou
            this.corsLogger.logForbidden(error);
          } else {
            // Outro erro HTTP
            this.corsLogger.logHttpError(error);
          }
          return throwError(() => error);
        })
      );
    }

    // Para requisições externas, passar normalmente
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.corsLogger.logHttpError(error);
        return throwError(() => error);
      })
    );
  }
}

