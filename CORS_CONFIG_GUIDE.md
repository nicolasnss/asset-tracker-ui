# 🔐 Guia de Configuração CORS - Angular + Spring Security

## 📋 Status Atual

✅ **Frontend Angular**: Configurado para enviar `withCredentials: true`
✅ **Origin**: `http://localhost:4200` (sem barra no final)
✅ **API Base URL**: `http://localhost:8080/api`

---

## 🎯 Configuração Esperada no Backend (Spring Boot)

### 1. Adicione a Dependência (pom.xml)

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

### 2. Classe de Configuração CORS + Spring Security

```java
package com.seu.projeto.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class CorsSecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors() // Ativa CORS com a configuração definida em corsConfigurationSource()
            .and()
            .csrf().disable() // Desabilitar CSRF para APIs REST (ou configurar adequadamente)
            .authorizeRequests()
                .antMatchers("/api/public/**").permitAll() // Rotas públicas, se houver
                .anyRequest().authenticated() // Todas outras rotas exigem autenticação
            .and()
            .httpBasic(); // Usar Basic Auth ou JWT conforme sua necessidade

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // ORIGEM - MUITO IMPORTANTE: Deve ser exatamente como vem do navegador
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
        
        // MÉTODOS HTTP
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        
        // HEADERS PERMITIDOS
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // PERMITIR CREDENTIALS (Cookies, Sessions, etc)
        configuration.setAllowCredentials(true);
        
        // TEMPO DE CACHE DO PREFLIGHT (segundos)
        configuration.setMaxAge(3600L);
        
        // HEADERS EXPOSTOS (para o frontend ler)
        configuration.setExposedHeaders(Arrays.asList(
            "Authorization", 
            "Content-Type", 
            "X-Custom-Header"
        ));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Aplicar a TODOS os endpoints
        return source;
    }
}
```

### 3. Configuração Alternativa com WebSecurityConfigurerAdapter (Versões antigas)

```java
@Configuration
@EnableWebSecurity
public class CorsSecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .cors()
            .and()
            .csrf().disable()
            .authorizeRequests()
                .anyRequest().authenticated()
            .and()
            .httpBasic();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
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
```

---

## 🔍 Testando a Configuração

### No Console do Navegador (F12 → Console)

#### Teste 1: Verificar Origin e Credentials
```javascript
// Deve mostrar: http://localhost:4200
console.log('Origin da aplicação:', window.location.origin);

// Fazer uma requisição com withCredentials
fetch('http://localhost:8080/api/assets', {
  method: 'GET',
  credentials: 'include', // Equivalente a withCredentials: true
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log('✅ Sucesso:', data))
.catch(err => console.error('❌ Erro:', err));
```

### Erros Comuns e Soluções

#### ❌ Erro: "Access to XMLHttpRequest has been blocked by CORS policy"

**Causa**: `allowCredentials(true)` é incompatível com `setAllowedOrigins(Arrays.asList("*"))`

**Solução**: Sempre especificar origem exata
```java
// ❌ ERRADO
configuration.setAllowedOrigins(Arrays.asList("*"));
configuration.setAllowCredentials(true); // Isso gera erro!

// ✅ CORRETO
configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
configuration.setAllowCredentials(true);
```

#### ❌ Erro: "HTTP 403 Forbidden"

**Causas possíveis**:
1. Usuário não autenticado (sem session/token válido)
2. Sem permissão para o recurso
3. CSRF token inválido (se CSRF está ativo)

**Solução**:
- Verificar se o usuário está autenticado
- Verificar permissões no backend
- Se usar JWT em vez de Session, ajustar o header de Authorization

#### ❌ Erro: "Status 0 - Network Error"

**Causas possíveis**:
1. Backend não está rodando
2. Porta incorreta (esperado 8080, mas está em outra)
3. Origin não configurado no backend
4. `withCredentials: true` não está sendo enviado

**Solução**:
- Verificar se backend está em `http://localhost:8080`
- Verificar logs do navegador (F12 → Network)
- Garantir que `HttpCredentialsInterceptor` está ativo no Angular

---

## 🧪 Logs do Angular

O frontend registra tudo no console para diagnosticar:

```
🚀 AMBIENTE DE EXECUÇÃO
App Origin: http://localhost:4200
API Base URL: http://localhost:8080/api

📤 GET http://localhost:8080/api/assets
origin: http://localhost:4200
withCredentials: true

✅ Sucesso: 200 - http://localhost:8080/api/assets
```

Se houver erro:

```
🚫 ERRO: CORS BLOQUEIO DE REDE (status 0)
❌ HTTP 403: PROIBIDO - Spring Security
```

---

## 📊 Fluxo Completo

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Angular faz requisição GET /api/assets                       │
│    com withCredentials: true (via Interceptor)                  │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. Navegador envia PREFLIGHT REQUEST (OPTIONS)                  │
│    Origin: http://localhost:4200                                │
│    Access-Control-Request-Method: GET                           │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. Spring Security valida CORS                                  │
│    ✅ Origin = http://localhost:4200? SIM                       │
│    ✅ allowCredentials = true? SIM                              │
│    ✅ Método GET permitido? SIM                                 │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Backend retorna headers CORS:                                │
│    Access-Control-Allow-Origin: http://localhost:4200           │
│    Access-Control-Allow-Credentials: true                       │
│    Access-Control-Allow-Methods: GET, POST, PUT, DELETE         │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. Navegador autoriza + Envia requisição real                   │
│    com Cookies/Session do navegador                             │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. Spring Security valida Session/Token                         │
│    ✅ Session válida? SIM → Retorna dados (200 OK)             │
│    ❌ Session inválida? NÃO → Retorna 403 Forbidden            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Checklist de Implementação

- [ ] `allowCredentials(true)` ativado no backend
- [ ] Origin exata: `http://localhost:4200`
- [ ] HttpCredentialsInterceptor ativo no Angular
- [ ] `withCredentials: true` em TODAS as requisições
- [ ] CorsLoggerService registrando erros
- [ ] Backend rodando em `http://localhost:8080`
- [ ] Console do navegador mostrando logs estruturados
- [ ] Teste de preflight passando
- [ ] Cookies/Session sendo enviados automaticamente

---

## 📞 Suporte

Se precisar de ajuda, verifique os logs:

1. **F12 → Console**: Procure por `🚀`, `📤`, `✅`, `❌`
2. **F12 → Network**: Clique na requisição e veja headers de CORS
3. **Backend Logs**: Procure por erros de Spring Security


