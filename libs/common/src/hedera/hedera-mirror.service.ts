import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HederaMirrorService {
  private readonly logger = new Logger(HederaMirrorService.name);
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env.HEDERA_MIRROR_NODE_URL ||
      'https://testnet.mirrornode.hedera.com/api/v1';
  }

  /**
   * Get topic messages from Hedera Mirror Node REST API
   * @param topicId Hedera Topic ID (e.g. 0.0.12345)
   */
  async getTopicMessages(topicId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/topics/${topicId}/messages`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch topic messages for ${topicId}`, error);
      throw error;
    }
  }

  /**
   * Get account details from Hedera Mirror Node
   * @param accountId Hedera Account ID (e.g. 0.0.67890)
   */
  async getAccountInfo(accountId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/accounts/${accountId}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch account info for ${accountId}`, error);
      throw error;
    }
  }
}
