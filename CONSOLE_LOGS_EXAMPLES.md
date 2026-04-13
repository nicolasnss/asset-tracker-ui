# 📋 Exemplos de Logs no Console

## ✅ Cenário: Tudo Funcionando

Ao abrir a aplicação (F12 → Console), você verá:

```
🚀 AMBIENTE DE EXECUÇÃO
┌─────────────────────────────────┐
│ App Origin    │ http://localhost:4200       │
│ API Base URL  │ http://localhost:8080/api   │
│ Navegador     │ Mozilla/5.0 (Windows NT...  │
│ Timestamp     │ 2026-04-13T21:30:00.000Z    │
└─────────────────────────────────┘

📋 CONFIGURAÇÃO CORS ESPERADA NO BACKEND
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

--- TESTE DE INTEGRAÇÃO INICIADO ---

📤 GET http://localhost:8080/api/assets/dashboard
┌──────────────────────────────────┐
│ origin           │ http://localhost:4200    │
│ withCredentials  │ true                     │
│ timestamp        │ 2026-04-13T21:30:05.123Z │
└──────────────────────────────────┘

✅ Sucesso: 200 - http://localhost:8080/api/assets/dashboard
┌──────────────────────────────────┐
│ data      │ { total_ativos: 5, ... │
│ timestamp │ 2026-04-13T21:30:05.456Z    │
└──────────────────────────────────┘

📤 GET http://localhost:8080/api/assets
┌──────────────────────────────────┐
│ origin           │ http://localhost:4200    │
│ withCredentials  │ true                     │
│ timestamp        │ 2026-04-13T21:30:06.123Z │
└──────────────────────────────────┘

✅ Sucesso: 200 - http://localhost:8080/api/assets
┌──────────────────────────────────┐
│ data      │ { content: [ {...}, ... │
│ timestamp │ 2026-04-13T21:30:06.456Z    │
└──────────────────────────────────┘

Estatísticas carregadas: {total_ativos: 5, disponivel: 3, em_uso: 2}
SUCESSO NA CONEXÃO: {total_ativos: 5, disponivel: 3, em_uso: 2}
```

---

## ❌ Cenário: Erro CORS - Status 0 (Bloqueio de Rede)

```
🚀 AMBIENTE DE EXECUÇÃO
┌─────────────────────────────────┐
│ App Origin    │ http://localhost:4200       │
│ API Base URL  │ http://localhost:8080/api   │
│ Navegador     │ Mozilla/5.0 (Windows NT...  │
│ Timestamp     │ 2026-04-13T21:30:00.000Z    │
└─────────────────────────────────┘

📤 GET http://localhost:8080/api/assets
┌──────────────────────────────────┐
│ origin           │ http://localhost:4200    │
│ withCredentials  │ true                     │
│ timestamp        │ 2026-04-13T21:30:05.123Z │
└──────────────────────────────────┘

🚫 ERRO: CORS BLOQUEIO DE REDE (status 0)
O navegador bloqueou a requisição. Possíveis causas:
{
  1: "Backend não está respondendo ao CORS preflight",
  2: "Credenciais não estão sendo enviadas (withCredentials != true)",
  3: "Origin não está configurado no CORS do backend",
  4: "Erro ao validar o certificado SSL (se HTTPS)"
}

┌────────────────────────────────────────┐
│ timestamp                               │ 2026-04-13T21:30:05.456Z    │
│ URL                                     │ http://localhost:8080/api/assets │
│ method                                  │ GET                         │
│ status                                  │ 0                           │
│ statusText                              │                             │
│ message                                 │ Http failure response: 0 Unknown Error │
│ withCredentials                         │ true                        │
│ expectedOrigin                          │ http://localhost:4200       │
│ corsBlockedNetworkError                 │ true                        │
│ forbiddenByServer                       │ false                       │
│ errorObject                             │ HttpErrorResponse {... │
└────────────────────────────────────────┘

ERRO AO CARREGAR ESTATÍSTICAS: HttpErrorResponse {headers: HttpHeaders, status: 0, statusText: "Unknown Error", url: "http://localhost:8080/api/assets", ok: false, type: 4, message: "Http failure response: 0 Unknown Error", name: "HttpErrorResponse", error: ProgressEvent}
```

### Soluções:

1. **Verificar se backend está rodando**
   ```bash
   # No terminal do backend
   mvn spring-boot:run
   # ou
   java -jar seu-app.jar
   ```

2. **Verificar configuração CORS**
   ```java
   configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
   configuration.setAllowCredentials(true);
   ```

3. **Verificar logs do backend**
   ```
   Look para CORS ou Spring Security errors
   ```

---

## ❌ Cenário: Erro 403 - Spring Security Forbidden

```
📤 POST http://localhost:8080/api/assets
┌──────────────────────────────────┐
│ origin           │ http://localhost:4200    │
│ withCredentials  │ true                     │
│ timestamp        │ 2026-04-13T21:30:05.123Z │
└──────────────────────────────────┘

🔐 HTTP 403: PROIBIDO - Spring Security
Possíveis causas:
{
  1: "Usuário não autenticado (sem Session/Token válido)",
  2: "Usuário autenticado mas sem permissão para o recurso",
  3: "CSRF token inválido (se aplicável)",
  4: "Credenciais expiradas"
}

┌────────────────────────────────────────┐
│ timestamp                               │ 2026-04-13T21:30:05.456Z    │
│ URL                                     │ http://localhost:8080/api/assets │
│ method                                  │ POST                        │
│ status                                  │ 403                         │
│ statusText                              │ Forbidden                   │
│ message                                 │ Http failure response: 403 Forbidden │
│ withCredentials                         │ true                        │
│ expectedOrigin                          │ http://localhost:4200       │
│ corsBlockedNetworkError                 │ false                       │
│ forbiddenByServer                       │ true                        │
│ errorObject                             │ HttpErrorResponse {... │
│ Response Headers                        │ {                           │
│                                         │   access-control-allow-credentials: true │
│                                         │   access-control-allow-origin: http://localhost:4200 │
│                                         │   content-type: application/json │
│                                         │ }                           │
│ Response Body                           │ {                           │
│                                         │   error: "Unauthorized",    │
│                                         │   message: "Full authentication is required" │
│                                         │ }                           │
└────────────────────────────────────────┘

ERRO AO CARREGAR ESTATÍSTICAS: HttpErrorResponse {headers: HttpHeaders, status: 403, statusText: "Forbidden", url: "http://localhost:8080/api/assets", ok: false, ...}
```

### Soluções:

1. **Autenticar com credenciais válidas**
   ```typescript
   this.authService.testarLogin('usuario', 'senha').subscribe({
     next: (dados) => console.log('Autenticado:', dados),
     error: (erro) => console.error('Erro de autenticação:', erro)
   });
   ```

2. **Verificar Spring Security no backend**
   ```java
   http.authorizeRequests()
       .antMatchers("/api/public/**").permitAll()
       .anyRequest().authenticated()
   ```

3. **Verificar logs do backend para detalhes**

---

## ✅ Cenário: Network Tab (F12 → Network)

### Requisição PREFLIGHT bem-sucedida (OPTIONS):

```
Request Method: OPTIONS
Request URL: http://localhost:8080/api/assets
Status Code: 200 OK

Request Headers:
  Origin: http://localhost:4200
  Access-Control-Request-Method: GET
  Access-Control-Request-Headers: content-type

Response Headers:
  Access-Control-Allow-Origin: http://localhost:4200
  Access-Control-Allow-Credentials: true
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
  Access-Control-Allow-Headers: *
  Access-Control-Max-Age: 3600
```

### Requisição GET bem-sucedida:

```
Request Method: GET
Request URL: http://localhost:8080/api/assets
Status Code: 200 OK

Request Headers:
  Origin: http://localhost:4200
  Cookie: JSESSIONID=ABC123DEF456...

Response Headers:
  Access-Control-Allow-Origin: http://localhost:4200
  Access-Control-Allow-Credentials: true
  Content-Type: application/json
  
Response Body:
  {
    "content": [
      { "id": 1, "nome": "Laptop", ... },
      { "id": 2, "nome": "Monitor", ... }
    ]
  }
```

---

## 🔍 Como Ler os Logs

### Cores no Console

- 🚀 **Azul claro**: Inicialização do ambiente
- 📤 **Azul claro**: Requisição enviada
- ✅ **Verde**: Sucesso
- ❌ **Vermelho**: Erro
- 🚫 **Vermelho em fundo**: CORS bloqueado
- 🔐 **Laranja**: Problema de autenticação
- ⚠️ **Amarelo**: Aviso

### Interpretação

```javascript
// ✅ TUDO BEM - Requisição concluída com sucesso
✅ Sucesso: 200 - http://localhost:8080/api/assets
data: { ... }

// ⚠️ ATENÇÃO - Erro de rede
🚫 ERRO: CORS BLOQUEIO DE REDE (status 0)
corsBlockedNetworkError: true

// 🔐 PROBLEMA - Usuário não autenticado
🔐 HTTP 403: PROIBIDO - Spring Security
forbiddenByServer: true

// ❌ ERRO GERAL
❌ HTTP [status] - [statusText]
message: "..."
```

---

## 📝 Dicas de Debugging

### 1. Ver todas as requisições
```javascript
// F12 → Network tab
// Filtrar por XHR (XMLHttpRequest)
```

### 2. Copiar cURL da requisição
```javascript
// F12 → Network → Click direito na requisição → Copy as cURL
curl 'http://localhost:8080/api/assets' \
  -H 'Origin: http://localhost:4200' \
  -H 'Credentials: include' \
  --compressed
```

### 3. Verificar headers enviados
```javascript
// F12 → Network → Clique na requisição → Headers
// Verificar se Origin está correto
```

### 4. Teste manual com fetch
```javascript
fetch('http://localhost:8080/api/assets', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(res => {
  console.log('Status:', res.status);
  console.log('Headers:', res.headers);
  return res.json();
})
.then(data => console.log('✅ Sucesso:', data))
.catch(err => console.error('❌ Erro:', err));
```


