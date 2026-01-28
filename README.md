# 🌦️ Weather Webhook para Chatvolt

Um servidor webhook que integra com Chatvolt Agent para fornecer informações meteorológicas em tempo real. Baseado na [documentação oficial de webhooks do Chatvolt](https://docs.chatvolt.ai/agent/webhooks).

## 📋 Descrição

Este projeto cria um servidor webhook que:
- Recebe eventos do Chatvolt Agent via Outbound Webhook
- Responde com informações climáticas atualizadas
- Fornece dados de usuário enriquecidos com informações meteorológicas
- Utiliza a API do OpenWeatherMap para dados em tempo real
- Implementa endpoints seguros com autenticação opcional

## 🏗️ Arquitetura

### Integração com Chatvolt

O serviço implementa **dois tipos de webhooks** conforme a documentação do Chatvolt:

1. **Outbound Webhook** (`/webhook`):
   - Recebe notificações de eventos do Chatvolt
   - Processa eventos como `AGENT_USER_MESSAGE`, `USER_MESSAGE_RECEIVED`, etc.
   - Responde com informações climáticas formatadas

2. **Fetch External User Information** (`/user-info`):
   - Fornece dados adicionais do usuário para o Inbox do Chatvolt
   - Enriquece o contexto da conversa com informações meteorológicas

### Tipos de Eventos Suportados

O webhook recebe e processa os seguintes tipos de eventos do Chatvolt:

- `USER_MESSAGE_RECEIVED` - Mensagem do usuário recebida (AI desabilitada)
- `AGENT_MESSAGE_SENDED` - Agente enviou mensagem via canal
- `AGENT_USER_MESSAGE` - Usuário enviou mensagem e agente respondeu (padrão)
- `AGENT_MESSAGE_FOLLOW_UP` - Agente enviou mensagem de follow-up
- `AGENT_MESSAGE_BLOCKED` - Mensagem do agente foi bloqueada
- `AGENT_MESSAGE_NOTED` - Mensagem registrada como nota
- `GROUP_MESSAGE_RECEIVED` - Mensagem recebida em grupo
- `STEP_ENTERED` - Conversa entrou em step específico do Flux CRM

## 🚀 Funcionalidades

- ✅ Servidor webhook HTTP com Express.js
- 🌡️ Informações climáticas em tempo real
- ☁️ Dados meteorológicos formatados em português
- 💧 Temperatura, umidade, vento e condições
- 🔒 Autenticação opcional via Bearer token
- 📊 Múltiplos endpoints para diferentes casos de uso
- 🏥 Health check endpoint
- 🇧🇷 Suporte completo para português brasileiro

## 📦 Requisitos

- Node.js 18 ou superior
- Uma conta no [OpenWeatherMap](https://openweathermap.org/api) para obter a API key
- Um agente configurado no [Chatvolt](https://chatvolt.ai)
- URL pública para receber webhooks (use ngrok, localtunnel, ou deploy em servidor)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Polabiel/weather-webhook.git
cd weather-webhook
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env`:
```env
PORT=3000
WEATHER_API_KEY=sua-chave-api-openweathermap
CITY=Sao Paulo
COUNTRY_CODE=BR
WEBHOOK_SECRET=seu-segredo-opcional
```

## 🎯 Como Obter as Credenciais

### OpenWeatherMap API Key
1. Acesse [https://openweathermap.org/api](https://openweathermap.org/api)
2. Crie uma conta gratuita
3. Vá para "API keys" no seu perfil
4. Copie a chave gerada

## ▶️ Uso

### 1. Inicie o servidor:
```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

### 2. Exponha o servidor para internet (desenvolvimento):

Usando ngrok:
```bash
ngrok http 3000
```

Você receberá uma URL pública como: `https://abc123.ngrok.io`

### 3. Configure no Chatvolt:

Acesse: **Agents > Selecione seu Agent > Settings > WebHooks**

#### Para Outbound Webhook:
- **URL**: `https://sua-url-publica.com/webhook`
- **Header** (opcional): `Authorization: Bearer seu-segredo-opcional`
- Marque os eventos que deseja receber

#### Para Fetch External User Information:
- **URL**: `https://sua-url-publica.com/user-info`
- **Header** (opcional): `Authorization: Bearer seu-segredo-opcional`

## 📡 Endpoints Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/webhook` | Recebe eventos do Chatvolt Outbound Webhook |
| `POST` | `/user-info` | Fornece informações de usuário para o Chatvolt |
| `GET` | `/weather` | Retorna informações climáticas atuais |
| `GET` | `/health` | Health check do servidor |

### Exemplo de Request/Response

**POST /webhook**
```json
// Request do Chatvolt
{
  "eventType": "AGENT_USER_MESSAGE",
  "conversationId": "abc123",
  "agentId": "agent-456",
  "userMessage": "Qual o clima hoje?",
  "channel": "whatsapp"
}

// Response do Webhook
{
  "success": true,
  "message": "🌤️ **Clima em São Paulo**\n\n🌡️ Temperatura: 25°C...",
  "eventType": "AGENT_USER_MESSAGE",
  "conversationId": "abc123",
  "weatherData": {
    "temperature": 25.5,
    "humidity": 65,
    "description": "céu limpo"
  }
}
```

## 📝 Payload do Webhook

O Chatvolt envia um payload JSON com os seguintes atributos (dependendo do evento):

### Atributos Principais (sempre incluídos):
- `eventType` - Tipo do evento
- `conversationId` - ID da conversa
- `agentId` - ID do agente
- `agentName` - Nome do agente
- `channel` - Canal da conversa
- `conversationStatus` - Status da conversa
- `isAiEnabled` - Se AI está habilitada
- `organizationId` - ID da organização

### Atributos Condicionais:
- `messageId` - ID da mensagem (eventos de mensagem)
- `userMessage` - Mensagem do usuário
- `agentResponse` - Resposta do agente
- `userName`, `userEmail`, `userPhoneNumber` - Dados do usuário
- `groupId`, `groupName` - Dados do grupo
- `scenarioId`, `stepId` - Dados do Flux CRM
- `tags` - Tags da conversa
- `frustration` - Nível de frustração

## ⚙️ Configuração

| Variável | Descrição | Padrão |
|----------|-----------|---------|
| `PORT` | Porta do servidor HTTP | `3000` |
| `WEATHER_API_KEY` | Chave da API do OpenWeatherMap | *Obrigatório* |
| `CITY` | Nome da cidade | `Sao Paulo` |
| `COUNTRY_CODE` | Código do país (ISO 3166) | `BR` |
| `WEBHOOK_SECRET` | Secret para autenticação (opcional) | - |

## 🛠️ Tecnologias Utilizadas

- **Node.js**: Runtime JavaScript
- **Express.js**: Framework web para criar o servidor HTTP
- **node-fetch**: Biblioteca para requisições HTTP
- **dotenv**: Gerenciamento de variáveis de ambiente
- **OpenWeatherMap API**: Fonte de dados meteorológicos
- **Chatvolt Webhooks**: Sistema de eventos do Chatvolt

## 📄 Estrutura do Projeto

```
weather-webhook/
├── index.js           # Servidor webhook principal
├── package.json       # Dependências e scripts
├── .env.example       # Exemplo de configuração
├── .gitignore         # Arquivos ignorados pelo git
├── test.js            # Testes básicos
└── README.md          # Documentação
```

## 🔒 Segurança

- Use `WEBHOOK_SECRET` para autenticar requisições do Chatvolt
- Configure o header no Chatvolt como: `Authorization: Bearer seu-segredo`
- Nunca commite o arquivo `.env` com suas credenciais
- Use HTTPS em produção
- Valide e sanitize todos os inputs recebidos

## 🚀 Deploy em Produção

### Opções de Deploy:

1. **Railway.app**: Deploy automático via GitHub
2. **Heroku**: `git push heroku main`
3. **DigitalOcean App Platform**: Deploy via interface
4. **AWS EC2/Elastic Beanstalk**: Para maior controle
5. **Vercel/Netlify**: Serverless functions

### Variáveis de Ambiente em Produção:
Configure as mesmas variáveis do `.env` no painel do seu provedor.

## 🧪 Testes

Execute os testes básicos:
```bash
npm test
```

Teste o endpoint de weather manualmente:
```bash
curl http://localhost:3000/weather
```

Teste o endpoint de health check:
```bash
curl http://localhost:3000/health
```

## 📚 Documentação de Referência

- [Chatvolt Agent Webhooks](https://docs.chatvolt.ai/agent/webhooks)
- [OpenWeatherMap API](https://openweathermap.org/api)
- [Express.js](https://expressjs.com/)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se livre para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests

## 📜 Licença

Este projeto está sob a licença MIT.

## 👤 Autor

Criado seguindo a documentação oficial do Chatvolt: https://docs.chatvolt.ai/agent/webhooks