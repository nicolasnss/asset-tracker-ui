# ⚡ Quick Start - CORS com Spring Security

## 🎯 O que foi feito no Frontend

### ✅ Instalado
- ✅ `HttpCredentialsInterceptor` - Adiciona automaticamente `withCredentials: true`
- ✅ `CorsLoggerService` - Registra tudo no console para debugging
- ✅ Configurado em `main.ts` - Ativo globalmente

### ✅ Garantido
- ✅ Origin exato: `http://localhost:4200` (sem barra)
- ✅ URL base: `http://localhost:8080/api` (sem barra)
- ✅ Todos os métodos HTTP: GET, POST, PUT, DELETE
- ✅ Logs coloridos mostrando cada requisição

---

## 📋 O que você precisa fazer no Backend

### 1. Criar classe de configuração

Arquivo: `src/main/java/com/seu/projeto/config/CorsSecurityConfig.java`

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
            .cors()  // Ativa CORS
            .and()
            .csrf().disable()  // Para APIs REST
            .authorizeRequests()
                .anyRequest().authenticated()  // Exigir autenticação
            .and()
            .httpBasic();  // Basic Auth

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);  // ⭐ MUITO IMPORTANTE
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### 2. Testar

Abrir navegador:

```
http://localhost:4200
```

Abrir F12 → Console e verificar:

```
🚀 AMBIENTE DE EXECUÇÃO
App Origin: http://localhost:4200
API Base URL: http://localhost:8080/api

📤 GET http://localhost:8080/api/assets/dashboard
origin: http://localhost:4200
withCredentials: true

✅ Sucesso: 200 - http://localhost:8080/api/assets/dashboard
```

---

## 🔍 Se der erro

### ❌ Erro: Status 0

```
🚫 ERRO: CORS BLOQUEIO DE REDE (status 0)
```

**Solução**: Verificar se backend está rodando em `http://localhost:8080`

```bash
# Terminal do backend
mvn spring-boot:run
```

### ❌ Erro: 403 Forbidden

```
🔐 HTTP 403: PROIBIDO - Spring Security
```

**Solução**: Usuário precisa estar autenticado. O backend está pedindo credenciais válidas.

---

## 📚 Documentação Completa

- `CORS_CONFIG_GUIDE.md` - Guia detalhado com todas as configurações
- `CORS_SETUP_SUMMARY.md` - Resumo das alterações realizadas
- `CONSOLE_LOGS_EXAMPLES.md` - Exemplos de logs e troubleshooting

---

## ✅ Checklist

### Frontend ✅

- [x] `HttpCredentialsInterceptor` criado
- [x] `CorsLoggerService` criado
- [x] `main.ts` configurado
- [x] Logs estruturados
- [x] Build sem erros

### Backend 📝

- [ ] Classe `CorsSecurityConfig` criada
- [ ] `allowCredentials(true)` adicionado
- [ ] Origin configurado: `http://localhost:4200`
- [ ] Backend rodando em `http://localhost:8080`
- [ ] Teste via navegador em `http://localhost:4200`

---

## 🚀 Próximos Passos

1. Copiar código da `CorsSecurityConfig` para seu backend
2. Reiniciar o backend
3. Abrir `http://localhost:4200` no navegador
4. Verificar console (F12) para logs
5. Se houver erro, consultar `CONSOLE_LOGS_EXAMPLES.md`


