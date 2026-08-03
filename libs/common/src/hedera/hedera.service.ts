import { Injectable, Logger } from '@nestjs/common';
import { 
  Client, 
  AccountId, 
  PrivateKey, 
  TopicCreateTransaction, 
  TopicMessageSubmitTransaction 
} from '@hashgraph/sdk';

@Injectable()
export class HederaService {
  private client: Client;
  private readonly logger = new Logger(HederaService.name);

  constructor() {
    this.initClient();
  }

  private initClient() {
    const rawAccountId = process.env.HEDERA_ACCOUNT_ID;
    const rawPrivateKey = process.env.HEDERA_PRIVATE_KEY;

    if (!rawAccountId || !rawPrivateKey) {
      this.logger.warn(
        'Hedera HEDERA_ACCOUNT_ID or HEDERA_PRIVATE_KEY missing in environment variables. Client initialization deferred.',
      );
      return;
    }

    try {
      const accountId = AccountId.fromString(rawAccountId);
      let privateKey: PrivateKey;
      
      try {
        privateKey = PrivateKey.fromStringECDSA(rawPrivateKey);
      } catch {
        try {
          privateKey = PrivateKey.fromStringED25519(rawPrivateKey);
        } catch {
          privateKey = PrivateKey.fromString(rawPrivateKey);
        }
      }

      this.client =
        process.env.HEDERA_NETWORK === 'mainnet'
          ? Client.forMainnet()
          : Client.forTestnet();

      this.client.setOperator(accountId, privateKey);
      this.logger.log('Hedera Client successfully initialized');
    } catch (error) {
      this.logger.error('Error initializing Hedera Client', error);
    }
  }

  private ensureClient(): Client {
    if (!this.client) {
      this.initClient();
    }
    if (!this.client) {
      throw new Error(
        'Hedera Client is not initialized. Please set HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY in .env file.',
      );
    }
    return this.client;
  }

  /**
   * নতুন একটি Topic তৈরি করা (যেখানে Text মেসেজ সেভ হবে)
   */
  async createTopic(): Promise<string> {
    try {
      const client = this.ensureClient();
      const transaction = new TopicCreateTransaction();
      const txResponse = await transaction.execute(client);
      const receipt = await txResponse.getReceipt(client);

      if (!receipt.topicId) {
        throw new Error('Failed to obtain topicId from receipt');
      }

      const topicIdStr = receipt.topicId.toString();
      this.logger.log(`New Hedera Topic Created: ${topicIdStr}`);
      return topicIdStr;
    } catch (error) {
      this.logger.error('Failed to create topic', error);
      throw error;
    }
  }

  /**
   * Topic-এ Text Message বা Event Log সেভ করা
   * @param topicId Hedera Topic ID
   * @param message Text বা JSON String
   */
  async submitTextMessage(topicId: string, message: string) {
    try {
      const client = this.ensureClient();
      const transaction = await new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(message)
        .execute(client);

      const receipt = await transaction.getReceipt(client);

      this.logger.log(
        `Message submitted to Topic ${topicId}. Status: ${receipt.status}`,
      );
      return {
        success: true,
        status: receipt.status.toString(),
        sequenceNumber: receipt.topicSequenceNumber
          ? receipt.topicSequenceNumber.toString()
          : '0',
      };
    } catch (error) {
      this.logger.error('Failed to submit text message', error);
      return { success: false, error: (error as Error).message };
    }
  }
}