import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

const CHATVOLT_WEBHOOK_URL = process.env.CHATVOLT_WEBHOOK_URL;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const CITY = process.env.CITY || 'Sao Paulo';
const COUNTRY_CODE = process.env.COUNTRY_CODE || 'BR';
const UPDATE_INTERVAL = parseInt(process.env.UPDATE_INTERVAL) || 60000; // Default: 1 minute

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
  const description = weatherData.weather[0].description;
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
 * Sends a message to the Chatvolt webhook
 */
async function sendToWebhook(message) {
  try {
    if (!CHATVOLT_WEBHOOK_URL) {
      throw new Error('CHATVOLT_WEBHOOK_URL is not configured');
    }
    
    const response = await fetch(CHATVOLT_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message
      })
    });
    
    if (!response.ok) {
      throw new Error(`Webhook error: ${response.status} ${response.statusText}`);
    }
    
    console.log('✅ Message sent successfully to Chatvolt webhook');
    return await response.json();
  } catch (error) {
    console.error('Error sending to webhook:', error.message);
    throw error;
  }
}

/**
 * Main function to fetch weather and send to webhook
 */
async function sendWeatherUpdate() {
  try {
    console.log(`\n🔄 Fetching weather data for ${CITY}, ${COUNTRY_CODE}...`);
    
    const weatherData = await getWeatherData();
    const message = formatWeatherMessage(weatherData);
    
    console.log('\n📝 Weather message:');
    console.log(message);
    console.log('\n📤 Sending to webhook...');
    
    await sendToWebhook(message);
  } catch (error) {
    console.error('❌ Error in sendWeatherUpdate:', error.message);
  }
}

/**
 * Validates configuration
 */
function validateConfig() {
  const errors = [];
  
  if (!CHATVOLT_WEBHOOK_URL) {
    errors.push('CHATVOLT_WEBHOOK_URL is not set');
  }
  
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
 * Start the weather webhook service
 */
async function start() {
  console.log('🌦️  Weather Webhook Service Starting...');
  console.log(`📍 City: ${CITY}, ${COUNTRY_CODE}`);
  console.log(`⏱️  Update interval: ${UPDATE_INTERVAL / 1000} seconds`);
  
  validateConfig();
  
  // Send first update immediately
  await sendWeatherUpdate();
  
  // Schedule periodic updates
  setInterval(sendWeatherUpdate, UPDATE_INTERVAL);
  
  console.log('\n✅ Service is running. Press Ctrl+C to stop.');
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
start().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
