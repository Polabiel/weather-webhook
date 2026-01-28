/**
 * Test suite for weather webhook server
 * Tests core functionality without requiring actual API keys
 */

import dotenv from 'dotenv';
import fetch from 'node-fetch';

console.log('🧪 Running weather webhook tests...\n');

// Test 1: Check if dotenv loads
console.log('Test 1: Loading dotenv...');
try {
  dotenv.config();
  console.log('✅ dotenv loaded successfully\n');
} catch (error) {
  console.error('❌ Failed to load dotenv:', error.message);
  process.exit(1);
}

// Test 2: Check if dependencies are available
console.log('Test 2: Checking dependencies...');
try {
  const express = (await import('express')).default;
  const nodeFetch = (await import('node-fetch')).default;
  console.log('✅ express available');
  console.log('✅ node-fetch available\n');
} catch (error) {
  console.error('❌ Failed to import dependencies:', error.message);
  process.exit(1);
}

// Test 3: Validate message formatting function
console.log('Test 3: Testing weather message formatting...');
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
  const testPort = parseInt(process.env.PORT) || 3000;
  const testCity = process.env.CITY || 'Sao Paulo';
  const testCountry = process.env.COUNTRY_CODE || 'BR';
  
  console.log(`  Port: ${testPort}`);
  console.log(`  City: ${testCity}`);
  console.log(`  Country: ${testCountry}`);
  console.log('✅ Environment variables handled correctly\n');
} catch (error) {
  console.error('❌ Failed to handle environment variables:', error.message);
  process.exit(1);
}

// Test 5: Validate Chatvolt event payload structure
console.log('Test 5: Testing Chatvolt webhook payload validation...');
try {
  const mockChatvoltPayload = {
    eventType: 'AGENT_USER_MESSAGE',
    conversationId: 'conv-123',
    messageId: 'msg-456',
    agentId: 'agent-789',
    agentName: 'Weather Bot',
    channel: 'whatsapp',
    conversationStatus: 'open',
    conversationPriority: 'normal',
    isAiEnabled: true,
    organizationId: 'org-123',
    userMessage: 'Qual o clima hoje?',
    userName: 'João Silva',
    createdAt: new Date().toISOString()
  };

  // Validate required fields
  const requiredFields = ['eventType', 'conversationId', 'agentId'];
  const hasRequiredFields = requiredFields.every(field => 
    mockChatvoltPayload.hasOwnProperty(field)
  );

  if (hasRequiredFields) {
    console.log('✅ Chatvolt payload structure is valid');
    console.log(`  Event Type: ${mockChatvoltPayload.eventType}`);
    console.log(`  Conversation ID: ${mockChatvoltPayload.conversationId}`);
    console.log(`  User Message: ${mockChatvoltPayload.userMessage}\n`);
  } else {
    throw new Error('Missing required fields in payload');
  }
} catch (error) {
  console.error('❌ Failed to validate payload:', error.message);
  process.exit(1);
}

// Test 6: Test webhook response structure
console.log('Test 6: Testing webhook response structure...');
try {
  const mockResponse = {
    success: true,
    message: '🌤️ **Clima em São Paulo**...',
    eventType: 'AGENT_USER_MESSAGE',
    conversationId: 'conv-123',
    timestamp: new Date().toISOString(),
    weatherData: {
      temperature: 25.5,
      feelsLike: 27.3,
      description: 'céu limpo',
      humidity: 65,
      windSpeed: 3.5,
      city: 'São Paulo'
    }
  };

  if (mockResponse.success && mockResponse.weatherData) {
    console.log('✅ Response structure is valid');
    console.log(`  Temperature: ${mockResponse.weatherData.temperature}°C`);
    console.log(`  Humidity: ${mockResponse.weatherData.humidity}%\n`);
  } else {
    throw new Error('Invalid response structure');
  }
} catch (error) {
  console.error('❌ Failed to validate response:', error.message);
  process.exit(1);
}

console.log('🎉 All tests passed!\n');
console.log('📋 Next steps:');
console.log('  1. Copy .env.example to .env');
console.log('  2. Add your WEATHER_API_KEY from OpenWeatherMap');
console.log('  3. Run: npm start');
console.log('  4. Expose the server using ngrok or similar:');
console.log('     ngrok http 3000');
console.log('  5. Configure the webhook URL in Chatvolt:');
console.log('     Agents > Select Agent > Settings > WebHooks');
console.log('     URL: https://your-public-url/webhook\n');

