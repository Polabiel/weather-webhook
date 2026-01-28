import dotenv from 'dotenv';
import express from 'express';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const CITY = process.env.CITY || 'Sao Paulo';
const COUNTRY_CODE = process.env.COUNTRY_CODE || 'BR';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || ''; // Optional authentication

const app = express();

// Middleware to parse JSON
app.use(express.json());

/**
 * Fetches weather data from OpenWeatherMap API
 */
async function getWeatherData() {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY_CODE}&appid=${WEATHER_API_KEY}&units=metric&lang=pt_br`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    throw error;
  }
}

/**
 * Formats weather data into a readable message
 */
function formatWeatherMessage(weatherData) {
  const temp = Math.round(weatherData.main.temp);
  const feelsLike = Math.round(weatherData.main.feels_like);
  const description = weatherData.weather[0]?.description || 'N/A';
  const humidity = weatherData.main.humidity;
  const windSpeed = weatherData.wind.speed;
  const cityName = weatherData.name;
  
  const message = `🌤️ **Clima em ${cityName}**\n\n` +
    `🌡️ Temperatura: ${temp}°C (Sensação: ${feelsLike}°C)\n` +
    `☁️ Condição: ${description}\n` +
    `💧 Umidade: ${humidity}%\n` +
    `💨 Vento: ${windSpeed} m/s\n\n` +
    `_Atualizado em: ${new Date().toLocaleString('pt-BR')}_`;
  
  return message;
}

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'weather-webhook'
  });
});

/**
 * Webhook endpoint to receive Chatvolt events
 * Handles all event types from Chatvolt Agent Webhooks
 */
app.post('/webhook', async (req, res) => {
  try {
    console.log('\n📨 Webhook received from Chatvolt');
    
    // Optional: Validate webhook secret if configured
    if (WEBHOOK_SECRET) {
      const authHeader = req.headers.authorization;
      if (authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
        console.error('❌ Invalid authentication');
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }
    
    const payload = req.body;
    console.log('Event Type:', payload.eventType);
    console.log('Conversation ID:', payload.conversationId);
    console.log('User Message:', payload.userMessage);
    
    // Get weather data
    const weatherData = await getWeatherData();
    const weatherMessage = formatWeatherMessage(weatherData);
    
    console.log('\n📝 Weather message prepared:');
    console.log(weatherMessage);
    
    // Respond with weather information
    // Chatvolt can use this response based on the event type
    res.json({
      success: true,
      message: weatherMessage,
      eventType: payload.eventType,
      conversationId: payload.conversationId,
      timestamp: new Date().toISOString(),
      weatherData: {
        temperature: weatherData.main.temp,
        feelsLike: weatherData.main.feels_like,
        description: weatherData.weather[0]?.description,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        city: weatherData.name
      }
    });
    
    console.log('✅ Response sent successfully\n');
  } catch (error) {
    console.error('❌ Error processing webhook:', error.message);
    res.status(500).json({ 
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Endpoint to fetch external user information
 * This can be configured in Chatvolt as "Fetch External User Information"
 */
app.post('/user-info', async (req, res) => {
  try {
    console.log('\n👤 User info request from Chatvolt');
    
    const payload = req.body;
    console.log('Requested for:', payload);
    
    // Get current weather as additional user context
    const weatherData = await getWeatherData();
    
    // Return enriched user information
    res.json({
      success: true,
      additionalInfo: {
        currentWeather: {
          temperature: `${Math.round(weatherData.main.temp)}°C`,
          condition: weatherData.weather[0]?.description,
          city: weatherData.name
        },
        timestamp: new Date().toISOString()
      }
    });
    
    console.log('✅ User info response sent\n');
  } catch (error) {
    console.error('❌ Error fetching user info:', error.message);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

/**
 * Manual weather endpoint - useful for testing
 */
app.get('/weather', async (req, res) => {
  try {
    const weatherData = await getWeatherData();
    const weatherMessage = formatWeatherMessage(weatherData);
    
    res.json({
      success: true,
      message: weatherMessage,
      data: weatherData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error fetching weather:', error.message);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

/**
 * Validates configuration
 */
function validateConfig() {
  const errors = [];
  
  if (!WEATHER_API_KEY) {
    errors.push('WEATHER_API_KEY is not set');
  }
  
  if (errors.length > 0) {
    console.error('❌ Configuration errors:');
    errors.forEach(error => console.error(`  - ${error}`));
    console.error('\nPlease create a .env file based on .env.example and configure the required variables.');
    process.exit(1);
  }
  
  console.log('✅ Configuration validated');
}

/**
 * Start the webhook server
 */
function start() {
  console.log('🌦️  Weather Webhook Service Starting...');
  console.log(`📍 City: ${CITY}, ${COUNTRY_CODE}`);
  console.log(`🔌 Port: ${PORT}`);
  
  validateConfig();
  
  app.listen(PORT, () => {
    console.log('\n✅ Webhook server is running!');
    console.log(`\n📡 Webhook endpoints:`);
    console.log(`   POST http://localhost:${PORT}/webhook - Receive Chatvolt events`);
    console.log(`   POST http://localhost:${PORT}/user-info - Fetch user information`);
    console.log(`   GET  http://localhost:${PORT}/weather - Get current weather`);
    console.log(`   GET  http://localhost:${PORT}/health - Health check`);
    console.log('\n📖 Configure these URLs in Chatvolt:');
    console.log('   Agents > Select Agent > Settings > WebHooks');
    console.log('\n⚠️  Note: For production, replace localhost with your public URL');
    console.log('\nPress Ctrl+C to stop.');
  });
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Shutting down gracefully...');
  process.exit(0);
});

// Start the service
start();
