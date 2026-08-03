import { HederaService } from '../libs/common/src/hedera/hedera.service';
import { HederaMirrorService } from '../libs/common/src/hedera/hedera-mirror.service';

async function main() {
  console.log('--- Testing Hedera Integration ---');
  console.log('Account ID:', process.env.HEDERA_ACCOUNT_ID);
  console.log('Network:', process.env.HEDERA_NETWORK || 'testnet');

  const hederaService = new HederaService();
  const mirrorService = new HederaMirrorService();

  try {
    console.log('\n1. Creating Hedera Topic...');
    const topicId = await hederaService.createTopic();
    console.log(`✅ Topic Created successfully! Topic ID: ${topicId}`);

    console.log('\n2. Submitting Test Message to Topic...');
    const payload = JSON.stringify({
      event: 'TEST_HEDERA_INTEGRATION',
      message: 'Hello Hedera Consensus Service from EventFlow!',
      timestamp: new Date().toISOString(),
    });
    const submitResult = await hederaService.submitTextMessage(topicId, payload);
    console.log('✅ Message Submit Result:', submitResult);

    console.log('\n3. Waiting 3 seconds for Mirror Node synchronization...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log('\n4. Fetching Topic Messages from Hedera Mirror Node...');
    const mirrorMessages = await mirrorService.getTopicMessages(topicId);
    console.log('✅ Mirror Node Response:', JSON.stringify(mirrorMessages, null, 2));

    console.log('\n🎉 Hedera Integration Test PASSED!');
    console.log(`🔗 Hashscan Explorer URL: https://hashscan.io/testnet/topic/${topicId}`);
  } catch (error) {
    console.error('❌ Hedera Test Failed:', error);
  }
}

main();
