# AssetTrackerUi

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.4.

## 🚀 Rápido Start (CORS + Spring Security)

> **Frontend está 100% pronto!** ✅ Basta implementar o backend.

### 1️⃣ Leia a Documentação
```bash
# Abra um destes arquivos (por ordem de complexidade):
- DOCUMENTATION_INDEX.md       # Índice centralizado
- README_CORS_QUICK_START.md   # 5 minutos (código pronto!)
- README_CORS_FINAL.md         # 10 minutos (visão geral)
- CORS_CONFIG_GUIDE.md         # 30 minutos (completo)
```

### 2️⃣ Copie o Código do Backend
```java
// Ver CORS_CONFIG_GUIDE.md para CorsSecurityConfig.java
// Salvar em: src/main/java/com/seu/projeto/config/
```

### 3️⃣ Teste
```bash
# Terminal 1: Frontend
npm start
# http://localhost:4200

# Terminal 2: Backend
mvn spring-boot:run
# http://localhost:8080

# Browser: F12 → Console
# Procure por: ✅ Sucesso
```

---

## 📚 Documentação CORS (Implementada)

| Arquivo | Tempo | Descrição |
|---------|-------|-----------|
| **DOCUMENTATION_INDEX.md** | - | 👈 Comece por aqui! Índice centralizado |
| **README_CORS_QUICK_START.md** | 5 min | Código Java + passos essenciais |
| **README_CORS_FINAL.md** | 10 min | Status completo do projeto |
| **CORS_CONFIG_GUIDE.md** | 30 min | Guia completo com exemplos |
| **CORS_ARCHITECTURE.md** | 20 min | Arquitetura e fluxo detalhado |
| **CONSOLE_LOGS_EXAMPLES.md** | 15 min | Exemplos de logs e debugging |
| **CORS_SETUP_SUMMARY.md** | 20 min | Resumo técnico |

---

## 🎯 O que foi Implementado (Frontend)

### ✨ Novos Arquivos
- `src/app/services/http-credentials.interceptor.ts` - Interceptor global CORS
- `src/app/services/cors-logger.service.ts` - Logs estruturados

### ✅ Arquivos Modificados
- `src/main.ts` - Registrou interceptor global
- `src/app/services/auth.ts` - Documentação completa
- `src/app/app.ts` - Logs de inicialização

### 🔐 Recursos Implementados
✅ `withCredentials: true` adicionado automaticamente  
✅ Origin correto: `http://localhost:4200`  
✅ URL base sem barras duplicadas  
✅ Logs estruturados com cores  
✅ Classificação de erros (CORS vs Security)  
✅ Build sem erros  

---

## 🧪 Desenvolvimento

### Development server

To start a local development server, run:

```bash
npm start
# ou
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

### Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

### Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

### Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
