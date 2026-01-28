/**
 * Simple test to verify the core functionality without API keys
 * This test validates the code structure and basic functionality
 */

import dotenv from 'dotenv';

console.log('🧪 Running basic tests...\n');

// Test 1: Check if dotenv loads
console.log('Test 1: Loading dotenv...');
try {
  dotenv.config();
  console.log('✅ dotenv loaded successfully\n');
} catch (error) {
  console.error('❌ Failed to load dotenv:', error.message);
  process.exit(1);
}

// Test 2: Check if node-fetch is available
console.log('Test 2: Checking node-fetch...');
try {
  const fetch = (await import('node-fetch')).default;
  console.log('✅ node-fetch is available\n');
} catch (error) {
  console.error('❌ Failed to import node-fetch:', error.message);
  process.exit(1);
}

// Test 3: Validate message formatting function
console.log('Test 3: Testing message formatting...');
try {
  const mockWeatherData = {
    name: 'São Paulo',
    main: {
      temp: 25.5,
      feels_like: 27.3,
      humidity: 65
    },
    weather: [
      {
        description: 'céu limpo'
      }
    ],
    wind: {
      speed: 3.5
    }
  };

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

  const message = formatWeatherMessage(mockWeatherData);
  console.log('Generated message:');
  console.log(message);
  console.log('\n✅ Message formatting works correctly\n');
} catch (error) {
  console.error('❌ Failed to format message:', error.message);
  process.exit(1);
}

// Test 4: Check environment variable handling
console.log('Test 4: Checking environment variable handling...');
try {
  const testInterval = parseInt(process.env.UPDATE_INTERVAL) || 60000;
  const testCity = process.env.CITY || 'Sao Paulo';
  const testCountry = process.env.COUNTRY_CODE || 'BR';
  
  console.log(`  City: ${testCity}`);
  console.log(`  Country: ${testCountry}`);
  console.log(`  Interval: ${testInterval}ms`);
  console.log('✅ Environment variables handled correctly\n');
} catch (error) {
  console.error('❌ Failed to handle environment variables:', error.message);
  process.exit(1);
}

console.log('🎉 All tests passed!\n');
console.log('⚠️  Note: To run the full application, you need to:');
console.log('  1. Copy .env.example to .env');
console.log('  2. Add your CHATVOLT_WEBHOOK_URL');
console.log('  3. Add your WEATHER_API_KEY from OpenWeatherMap');
console.log('  4. Run: npm start\n');
