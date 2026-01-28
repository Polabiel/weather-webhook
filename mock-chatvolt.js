/**
 * Mock Chatvolt webhook sender for testing
 * This script simulates Chatvolt sending webhook events to your local server
 * 
 * Usage:
 * 1. Start your webhook server: npm start
 * 2. In another terminal, run: node mock-chatvolt.js
 */

import fetch from 'node-fetch';

const WEBHOOK_URL = 'http://localhost:3000/webhook';

// Mock Chatvolt event payload
const mockEvent = {
  eventType: 'AGENT_USER_MESSAGE',
  conversationId: 'conv-abc123',
  messageId: 'msg-xyz789',
  agentId: 'agent-456',
  agentName: 'Weather Assistant',
  channel: 'whatsapp',
  conversationStatus: 'open',
  conversationPriority: 'normal',
  isAiEnabled: true,
  organizationId: 'org-123',
  userName: 'João Silva',
  userEmail: 'joao@example.com',
  userPhoneNumber: '+5511999999999',
  userMessage: 'Qual o clima hoje?',
  createdAt: new Date().toISOString(),
  tags: ['weather', 'query']
};

console.log('🧪 Testing Chatvolt Webhook Integration\n');
console.log('Sending mock event to:', WEBHOOK_URL);
console.log('\nPayload:');
console.log(JSON.stringify(mockEvent, null, 2));
console.log('\n---\n');

try {
  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Uncomment if you set WEBHOOK_SECRET in .env
      // 'Authorization': 'Bearer your-secret-here'
    },
    body: JSON.stringify(mockEvent)
  });

  console.log('Response status:', response.status, response.statusText);
  
  const data = await response.json();
  console.log('\nResponse data:');
  console.log(JSON.stringify(data, null, 2));
  
  if (data.success) {
    console.log('\n✅ Test successful!');
    console.log('\nWeather message that would be sent to user:');
    console.log('---');
    console.log(data.message);
    console.log('---');
  } else {
    console.log('\n❌ Test failed:', data.error);
  }
} catch (error) {
  console.error('\n❌ Error testing webhook:', error.message);
  console.error('\nMake sure your webhook server is running:');
  console.error('  npm start');
  process.exit(1);
}
