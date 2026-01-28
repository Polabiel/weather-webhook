# 🔌 Integração com Chatvolt - Guia Completo

Este guia explica como integrar o Weather Webhook com o Chatvolt Agent.

## 📖 Sobre os Webhooks do Chatvolt

O Chatvolt Agent oferece dois tipos de webhooks:

### 1. Outbound Webhook (Webhook de Saída)
O Chatvolt **envia** notificações para uma URL externa quando eventos de conversa ocorrem.

**Nosso endpoint**: `POST /webhook`

**Como funciona**:
1. Um usuário envia uma mensagem para o agente Chatvolt
2. O Chatvolt processa a mensagem
3. O Chatvolt envia um payload JSON para nossa URL `/webhook`
4. Nosso servidor processa a requisição e responde com dados do clima
5. O Chatvolt pode usar essa resposta no contexto da conversa

### 2. Fetch External User Information (Buscar Informações do Usuário)
O Chatvolt **solicita** informações adicionais do usuário de uma URL externa.

**Nosso endpoint**: `POST /user-info`

**Como funciona**:
1. O Chatvolt precisa de informações adicionais sobre um usuário
2. Chama nossa URL `/user-info` com os dados do usuário
3. Respondemos com informações contextuais (clima atual, etc.)
4. Essas informações aparecem no Inbox do Chatvolt

## 🚀 Configuração Passo a Passo

### Passo 1: Preparar o Servidor

1. Clone e configure o projeto:
```bash
git clone https://github.com/Polabiel/weather-webhook.git
cd weather-webhook
npm install
```

2. Configure o arquivo `.env`:
```bash
cp .env.example .env
nano .env
```

Adicione sua chave do OpenWeatherMap:
```env
PORT=3000
WEATHER_API_KEY=sua-chave-aqui
CITY=Sao Paulo
COUNTRY_CODE=BR
WEBHOOK_SECRET=meu-segredo-123  # Opcional
```

3. Inicie o servidor:
```bash
npm start
```

### Passo 2: Expor o Servidor (Desenvolvimento)

Para testes locais, você precisa expor seu servidor para a internet.

**Opção A: Usando ngrok**
```bash
# Instale ngrok: https://ngrok.com/download
ngrok http 3000
```

Você receberá uma URL como: `https://abc123.ngrok.io`

**Opção B: Usando localtunnel**
```bash
npx localtunnel --port 3000
```

### Passo 3: Configurar no Chatvolt

1. Acesse o Chatvolt: https://chatvolt.ai
2. Vá para: **Agents** > **Selecione seu Agent** > **Settings** > **WebHooks**

#### Configurar Outbound Webhook:

**URL**: `https://sua-url-publica.ngrok.io/webhook`

**Header** (se configurou WEBHOOK_SECRET):
```
Authorization: Bearer meu-segredo-123
```

**Eventos**: Selecione os eventos que deseja receber, por exemplo:
- ✅ AGENT_USER_MESSAGE
- ✅ USER_MESSAGE_RECEIVED

#### Configurar Fetch External User Information:

**URL**: `https://sua-url-publica.ngrok.io/user-info`

**Header** (opcional):
```
Authorization: Bearer meu-segredo-123
```

### Passo 4: Testar a Integração

1. Com o servidor rodando, teste manualmente:
```bash
curl http://localhost:3000/health
curl http://localhost:3000/weather
```

2. Teste com o mock do Chatvolt:
```bash
node mock-chatvolt.js
```

3. Teste no Chatvolt:
   - Envie uma mensagem para seu agente
   - Verifique os logs do seu servidor
   - Você deve ver o evento sendo recebido e processado

## 📊 Fluxo de Dados

```
┌─────────────┐          ┌──────────────┐          ┌────────────────┐
│   Usuário   │──────────>│   Chatvolt   │──────────>│  Seu Servidor  │
│  (WhatsApp) │  mensagem │    Agent     │  webhook │  (Express.js)  │
└─────────────┘          └──────────────┘          └────────────────┘
                                 │                           │
                                 │                           │
                                 │                           v
                                 │                  ┌──────────────┐
                                 │<─────────────────│ OpenWeather  │
                                 │   resposta clima │     API      │
                                 │                  └──────────────┘
                                 v
                          ┌─────────────┐
                          │   Usuário   │
                          │  recebe     │
                          │    clima    │
                          └─────────────┘
```

## 🔐 Segurança

### Autenticação com Bearer Token

1. Configure `WEBHOOK_SECRET` no `.env`:
```env
WEBHOOK_SECRET=meu-token-secreto-aqui
```

2. No Chatvolt, adicione o header:
```
Authorization: Bearer meu-token-secreto-aqui
```

3. O servidor validará todas as requisições

### HTTPS em Produção

⚠️ **Importante**: Em produção, sempre use HTTPS!

- Ngrok fornece HTTPS automaticamente
- Serviços como Railway, Heroku, Vercel fornecem HTTPS
- Configure SSL/TLS no seu servidor se hospedar próprio

## 📋 Tipos de Eventos

### Eventos que você pode receber:

| Evento | Quando é disparado |
|--------|-------------------|
| `USER_MESSAGE_RECEIVED` | Usuário envia mensagem (AI desabilitada) |
| `AGENT_MESSAGE_SENDED` | Agente envia mensagem via canal |
| `AGENT_USER_MESSAGE` | Usuário envia e agente responde (padrão) |
| `AGENT_MESSAGE_FOLLOW_UP` | Mensagem de follow-up do agente |
| `AGENT_MESSAGE_BLOCKED` | Mensagem bloqueada (janela 24h) |
| `AGENT_MESSAGE_NOTED` | Mensagem registrada como nota |
| `GROUP_MESSAGE_RECEIVED` | Mensagem em grupo (ZAPI) |
| `STEP_ENTERED` | Entrada em step do Flux CRM |

### Payload do Webhook

Exemplo de payload recebido:
```json
{
  "eventType": "AGENT_USER_MESSAGE",
  "conversationId": "conv-123",
  "messageId": "msg-456",
  "agentId": "agent-789",
  "agentName": "Weather Bot",
  "channel": "whatsapp",
  "conversationStatus": "open",
  "isAiEnabled": true,
  "userName": "João Silva",
  "userMessage": "Qual o clima?",
  "createdAt": "2026-01-28T17:00:00Z"
}
```

### Resposta do Webhook

Nosso servidor responde com:
```json
{
  "success": true,
  "message": "🌤️ **Clima em São Paulo**\n\n🌡️ Temperatura: 25°C...",
  "eventType": "AGENT_USER_MESSAGE",
  "conversationId": "conv-123",
  "timestamp": "2026-01-28T17:00:05Z",
  "weatherData": {
    "temperature": 25.5,
    "feelsLike": 27.3,
    "description": "céu limpo",
    "humidity": 65,
    "windSpeed": 3.5,
    "city": "São Paulo"
  }
}
```

## 🚀 Deploy em Produção

### Opções recomendadas:

#### 1. Railway.app (Recomendado)
```bash
# Instale Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

Configure as variáveis de ambiente no painel do Railway.

#### 2. Heroku
```bash
heroku create weather-webhook
heroku config:set WEATHER_API_KEY=sua-chave
git push heroku main
```

#### 3. DigitalOcean App Platform
- Conecte seu repositório GitHub
- Configure as variáveis de ambiente
- Deploy automático

### Após o Deploy:

1. Copie a URL de produção (ex: `https://weather-webhook.railway.app`)
2. Atualize as URLs no Chatvolt:
   - `/webhook` → `https://weather-webhook.railway.app/webhook`
   - `/user-info` → `https://weather-webhook.railway.app/user-info`

## 🐛 Troubleshooting

### Servidor não recebe webhooks:
- ✅ Verifique se o servidor está rodando
- ✅ Verifique se a URL está acessível publicamente
- ✅ Verifique os logs do servidor
- ✅ Teste com `curl` ou Postman

### Erro 401 Unauthorized:
- ✅ Verifique se o `WEBHOOK_SECRET` está correto
- ✅ Verifique o header `Authorization` no Chatvolt

### Erro ao buscar clima:
- ✅ Verifique se `WEATHER_API_KEY` está correta
- ✅ Teste: `curl http://localhost:3000/weather`
- ✅ Verifique a cidade e código do país no `.env`

### Logs úteis:
```bash
# Ver logs em tempo real
tail -f logs/app.log

# No Railway/Heroku
railway logs
heroku logs --tail
```

## 📚 Referências

- [Documentação Chatvolt Webhooks](https://docs.chatvolt.ai/agent/webhooks)
- [OpenWeatherMap API](https://openweathermap.org/api)
- [Express.js](https://expressjs.com/)
- [ngrok](https://ngrok.com/)

## 💡 Dicas

1. **Desenvolvimento**: Use ngrok para testes rápidos
2. **Staging**: Use Railway ou Heroku para ambiente de homologação
3. **Produção**: Use serviços com alta disponibilidade e monitoramento
4. **Logs**: Sempre monitore os logs para debug
5. **Segurança**: Sempre use WEBHOOK_SECRET em produção
6. **Rate Limiting**: Considere adicionar rate limiting para proteção
