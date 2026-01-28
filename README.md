# 🌦️ Weather Webhook

Um webhook automatizado que envia atualizações do clima a cada 1 minuto para o Chatvolt usando a API do OpenWeatherMap.

## 📋 Descrição

Este projeto cria um serviço que:
- Busca dados meteorológicos em tempo real do OpenWeatherMap
- Formata as informações do clima em uma mensagem legível
- Envia a mensagem para um webhook do Chatvolt a cada 1 minuto
- Utiliza `fetch` para fazer as requisições HTTP

## 🚀 Funcionalidades

- ✅ Atualização automática a cada 1 minuto (configurável)
- 🌡️ Temperatura atual e sensação térmica
- ☁️ Condições climáticas
- 💧 Umidade do ar
- 💨 Velocidade do vento
- 🇧🇷 Suporte para português brasileiro
- ⚙️ Configuração via variáveis de ambiente

## 📦 Requisitos

- Node.js 18 ou superior
- Uma conta no [OpenWeatherMap](https://openweathermap.org/api) para obter a API key
- Um webhook do Chatvolt (consulte a [documentação](https://docs.chatvolt.ai/agent/webhooks))

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

4. Edite o arquivo `.env` com suas credenciais:
```env
CHATVOLT_WEBHOOK_URL=https://seu-webhook.chatvolt.ai/webhook/seu-id
WEATHER_API_KEY=sua-chave-api-openweathermap
CITY=Sao Paulo
COUNTRY_CODE=BR
UPDATE_INTERVAL=60000
```

## 🎯 Como Obter as Credenciais

### OpenWeatherMap API Key
1. Acesse [https://openweathermap.org/api](https://openweathermap.org/api)
2. Crie uma conta gratuita
3. Vá para "API keys" no seu perfil
4. Copie a chave gerada

### Chatvolt Webhook URL
1. Acesse sua conta no Chatvolt
2. Configure um webhook seguindo a [documentação oficial](https://docs.chatvolt.ai/agent/webhooks)
3. Copie a URL do webhook gerada

## ▶️ Uso

Execute o serviço:
```bash
npm start
```

Para desenvolvimento:
```bash
npm run dev
```

O serviço irá:
1. Validar as configurações
2. Enviar a primeira atualização imediatamente
3. Continuar enviando atualizações a cada 1 minuto
4. Exibir logs no console

## 📝 Exemplo de Mensagem

```
🌤️ **Clima em São Paulo**

🌡️ Temperatura: 25°C (Sensação: 27°C)
☁️ Condição: céu limpo
💧 Umidade: 65%
💨 Vento: 3.5 m/s

_Atualizado em: 28/01/2026 14:30:00_
```

## ⚙️ Configuração

Você pode personalizar o comportamento através das variáveis de ambiente:

| Variável | Descrição | Padrão |
|----------|-----------|---------|
| `CHATVOLT_WEBHOOK_URL` | URL do webhook do Chatvolt | *Obrigatório* |
| `WEATHER_API_KEY` | Chave da API do OpenWeatherMap | *Obrigatório* |
| `CITY` | Nome da cidade | `Sao Paulo` |
| `COUNTRY_CODE` | Código do país (ISO 3166) | `BR` |
| `UPDATE_INTERVAL` | Intervalo entre atualizações (ms) | `60000` (1 minuto) |

## 🛠️ Tecnologias Utilizadas

- **Node.js**: Runtime JavaScript
- **node-fetch**: Biblioteca para fazer requisições HTTP com fetch API
- **dotenv**: Gerenciamento de variáveis de ambiente
- **OpenWeatherMap API**: Fonte de dados meteorológicos
- **Chatvolt Webhooks**: Destino das mensagens

## 📄 Estrutura do Projeto

```
weather-webhook/
├── index.js           # Script principal
├── package.json       # Dependências e scripts
├── .env.example       # Exemplo de configuração
├── .gitignore         # Arquivos ignorados pelo git
└── README.md          # Documentação
```

## 🔒 Segurança

- Nunca commite o arquivo `.env` com suas credenciais
- As variáveis de ambiente estão listadas no `.gitignore`
- Mantenha suas chaves de API em segurança

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se livre para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests

## 📜 Licença

Este projeto está sob a licença MIT.

## 👤 Autor

Criado seguindo a documentação do Chatvolt: https://docs.chatvolt.ai/agent/webhooks