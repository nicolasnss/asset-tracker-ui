# 🏗️ Arquitetura CORS - Angular + Spring Security

## 📂 Estrutura de Arquivos Criados

```
src/
├── app/
│   ├── services/
│   │   ├── auth.ts                          ✅ Melhorado com documentação
│   │   ├── http-credentials.interceptor.ts  ✨ NOVO - Interceptor global
│   │   └── cors-logger.service.ts           ✨ NOVO - Logging estruturado
│   ├── app.ts                               ✅ Atualizado com CorsLoggerService
│   └── ...
├── main.ts                                  ✅ Atualizado com interceptor global
└── ...

/ (raiz do projeto)
├── CORS_CONFIG_GUIDE.md                     ✨ NOVO - Guia completo
├── CORS_SETUP_SUMMARY.md                    ✨ NOVO - Resumo de alterações
├── CONSOLE_LOGS_EXAMPLES.md                 ✨ NOVO - Exemplos de logs
└── README_CORS_QUICK_START.md               ✨ NOVO - Quick start
```

---

## 🔄 Fluxo de Requisição Detalhado

```
┌─────────────────────────────────────────────────────────────────────┐
│ PASSO 1: Component faz requisição                                   │
└─────────────┬───────────────────────────────────────────────────────┘
              │
              │ this.authService.listarAtivos()
              │
              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ PASSO 2: AuthService executa http.get()                            │
│         GET http://localhost:8080/api/assets                       │
└─────────────┬───────────────────────────────────────────────────────┘
              │
              │ HttpClient
              │
              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ PASSO 3: HttpCredentialsInterceptor intercepta a requisição        │
│         - Detecta que é para localhost:8080? ✅ SIM                │
│         - Clona a requisição                                        │
│         - Adiciona withCredentials: true                            │
│         - Registra com CorsLoggerService                            │
└─────────────┬───────────────────────────────────────────────────────┘
              │
              │ Requisição modificada com credentials
              │
              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ PASSO 4: Navegador envia PREFLIGHT REQUEST (OPTIONS)              │
│         Method: OPTIONS                                             │
│         Origin: http://localhost:4200                               │
│         Access-Control-Request-Method: GET                          │
│         Access-Control-Request-Headers: content-type                │
└─────────────┬───────────────────────────────────────────────────────┘
              │ (vai para o backend)
              │
              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ PASSO 5: Spring Security CORS valida PREFLIGHT                     │
│         - allowCredentials = true? ✅                               │
│         - Origin = http://localhost:4200? ✅                        │
│         - Método GET permitido? ✅                                  │
│         - Headers permitidos? ✅                                    │
└─────────────┬───────────────────────────────────────────────────────┘
              │
              │ Retorna 200 OK com headers CORS
              │
              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ PASSO 6: Navegador autoriza + envia requisição REAL                │
│         GET http://localhost:8080/api/assets                       │
│         Cookie: JSESSIONID=... (Cookies são enviados!)             │
│         Authorization: Basic ...                                    │
└─────────────┬───────────────────────────────────────────────────────┘
              │ (vai para o backend)
              │
              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ PASSO 7: Spring Security valida requisição real                    │
│         - Extrai Session do Cookie                                  │
│         - Valida Session/Token                                      │
│         - Verifica permissões                                       │
│         - ✅ Retorna 200 OK + dados                                 │
│         - ❌ OU Retorna 403 Forbidden                               │
└─────────────┬───────────────────────────────────────────────────────┘
              │
              │ Response com headers CORS
              │
              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ PASSO 8: HttpCredentialsInterceptor recebe resposta                │
│         - Se sucesso (200): Registra com tap()                      │
│         - Se erro: Registra classificado com CorsLoggerService      │
│           - Status 0? → CORS Network Error                          │
│           - Status 403? → Spring Security Forbidden                 │
│           - Outro? → HTTP Error genérico                            │
└─────────────┬───────────────────────────────────────────────────────┘
              │
              │ Observable com dados ou erro
              │
              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ PASSO 9: Component recebe dados/erro                               │
│         - Subscribe next() → Renderizar dados                       │
│         - Subscribe error() → Mostrar erro                          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🧩 Componentes e Responsabilidades

### HttpCredentialsInterceptor
```
📌 Responsabilidade:
   - Adicionar withCredentials: true
   - Filtrar apenas localhost:8080
   - Interceptar respostas/erros
   - Chamar CorsLoggerService

📍 Localização: src/app/services/http-credentials.interceptor.ts
🔗 Integrado em: main.ts (HTTP_INTERCEPTORS)
```

### CorsLoggerService
```
📌 Responsabilidade:
   - Logar ambiente de execução
   - Logar início de requisições
   - Logar sucesso com dados
   - Classificar e logar erros
   - Mostrar configuração esperada

📍 Localização: src/app/services/cors-logger.service.ts
🔗 Integrado em: main.ts (providers)
🔗 Usado por: HttpCredentialsInterceptor, App Component
```

### AuthService
```
📌 Responsabilidade:
   - Fornecer métodos HTTP
   - Usar URL base correta
   - Delegar credenciais ao interceptor

📍 Localização: src/app/services/auth.ts
🔗 URL Base: http://localhost:8080/api (sem barra)
🔗 Métodos: getDashboardStats, getFuncionarios, listarAtivos, 
            salvarAtivo, atualizarAtivo, excluirAtivo
```

### App Component
```
📌 Responsabilidade:
   - Injetar CorsLoggerService
   - Chamar logCorsConfiguration() no ngOnInit
   - Exibir configuração esperada no console

📍 Localização: src/app/app.ts
🔗 Integração: ngOnInit()
```

---

## 🔐 Segurança: O que Mudou

### Antes ❌
```typescript
// Sem credentials
http.get('/api/assets');  // Cookies NÃO são enviados
// Resultado: 403 Forbidden
```

### Depois ✅
```typescript
// Com interceptor automático
http.get('/api/assets');  // withCredentials: true adicionado
// Resultado: 200 OK (com dados)
```

---

## 📊 Matiz de Responsabilidades

| Componente | Frontend | Backend |
|-----------|----------|---------|
| **Origin** | `http://localhost:4200` | Configurar CORS para aceitar |
| **withCredentials** | ✅ HttpCredentialsInterceptor | N/A |
| **allowCredentials** | N/A | ✅ `configuration.setAllowCredentials(true)` |
| **Métodos HTTP** | ✅ Todos GET,POST,PUT,DELETE | ✅ Permitir via CORS |
| **Headers** | ✅ Enviados automaticamente | ✅ Permitir via CORS |
| **Cookies/Session** | ✅ Enviados automaticamente | ✅ Validar no backend |
| **Logging** | ✅ CorsLoggerService | Verificar logs do backend |

---

## 🧪 Como Testar

### 1. Iniciar Backend
```bash
cd seu-projeto-java
mvn spring-boot:run
# Deve estar rodando em http://localhost:8080
```

### 2. Iniciar Frontend
```bash
cd asset-tracker-ui
npm start
# Deve estar rodando em http://localhost:4200
```

### 3. Abrir Navegador
```
http://localhost:4200
```

### 4. Abrir Console (F12)
```
Deve mostrar:
🚀 AMBIENTE DE EXECUÇÃO
📋 CONFIGURAÇÃO CORS ESPERADA NO BACKEND
📤 GET http://localhost:8080/api/assets/dashboard
✅ Sucesso: 200 - http://localhost:8080/api/assets/dashboard
```

---

## 🚨 Troubleshooting Rápido

| Erro | Causa | Solução |
|------|-------|---------|
| Status 0 | CORS bloqueado | Verificar backend + CorsConfiguration |
| 403 Forbidden | Não autenticado | Enviar credenciais válidas |
| Preflight falha | Origin não permitido | Configurar origem exata |
| Cookies não enviados | withCredentials=false | Já está implementado ✅ |
| Sem logs | CorsLoggerService não injetado | Verificar main.ts |

---

## 📝 Próximas Ações

### ✅ Frontend Pronto

- [x] HttpCredentialsInterceptor implementado
- [x] CorsLoggerService implementado
- [x] main.ts configurado
- [x] Logs estruturados
- [x] Build sem erros

### 📝 Backend (Você deve fazer)

- [ ] Criar CorsSecurityConfig.java
- [ ] Configurar `allowCredentials(true)`
- [ ] Configurar `Origin: http://localhost:4200`
- [ ] Testar PREFLIGHT (OPTIONS)
- [ ] Testar requisição real com credenciais

---

## 📚 Documentação

Leia na seguinte ordem:

1. **README_CORS_QUICK_START.md** - Introdução rápida ⚡
2. **CORS_CONFIG_GUIDE.md** - Implementação completa 📖
3. **CONSOLE_LOGS_EXAMPLES.md** - Exemplos de logs e debugging 🔍
4. **CORS_SETUP_SUMMARY.md** - Resumo técnico 📋

---

## 🎯 Conclusão

Frontend está 100% pronto! ✅

Agora você só precisa implementar a `CorsSecurityConfig` no backend e será a glória! 🚀


