

# Hedera Implementation Guide for EventFlow Manage

এই ডকুমেন্টে `eventflow-manage` NestJS Monorepo-তে Hedera ব্লকচেইন (HCS এবং HTS) যুক্ত করার গাইডলাইন এবং "Text/Message" ইমপ্লিমেন্ট করার কোড স্ট্রাকচার দেওয়া হলো।

## ১. প্রজেক্ট সেটআপ ও ডিপেন্ডেন্সি (Dependencies)

প্রথমে রুটে Hedera SDK ইনস্টল করতে হবে:

```bash
npm install @hashgraph/sdk @nestjs/axios axios

```

আপনার রুটের `.env` ফাইলে নিচের ক্রেডেনশিয়ালগুলো যুক্ত করুন:

```env
HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=0.0.XXXXXX
HEDERA_PRIVATE_KEY=302e02010030...

```

## ২. ফোল্ডার স্ট্রাকচার (libs/common)

যেহেতু এটি মনোরেপো, Hedera-র মূল কোড `libs/common`-এ থাকবে।

```text
libs/common/src/
├── hedera/
│   ├── hedera.module.ts
│   ├── hedera.service.ts         # মূল লজিক (HCS Text Message, HTS)
│   ├── hedera-mirror.service.ts
│   └── interfaces/

```

## ৩. Text/Message ইমপ্লিমেন্টেশন (Hedera Consensus Service)

Hedera-তে যেকোনো **Text** বা **Immutable Log** সেভ করার জন্য **Hedera Consensus Service (HCS)** ব্যবহার করা হয়। নিচে `hedera.service.ts` ফাইলে এটি ইমপ্লিমেন্ট করার পদ্ধতি দেখানো হলো:

**ফাইল:** `libs/common/src/hedera/hedera.service.ts`

```typescript
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
    const accountId = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID);
    const privateKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY);
    
    // নেটওয়ার্ক সেটআপ
    this.client = process.env.HEDERA_NETWORK === 'mainnet' 
      ? Client.forMainnet() 
      : Client.forTestnet();

    this.client.setOperator(accountId, privateKey);
    this.logger.log('Hedera Client Initialized');
  }

  /**
   * নতুন একটি Topic তৈরি করা (যেখানে Text মেসেজ সেভ হবে)
   */
  async createTopic(): Promise<string> {
    try {
      const transaction = new TopicCreateTransaction();
      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);
      
      this.logger.log(`New Hedera Topic Created: ${receipt.topicId}`);
      return receipt.topicId.toString();
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
      const transaction = await new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(message)
        .execute(this.client);

      const receipt = await transaction.getReceipt(this.client);
      
      this.logger.log(`Message submitted to Topic ${topicId}. Status: ${receipt.status}`);
      return {
        success: true,
        status: receipt.status.toString(),
        sequenceNumber: receipt.topicSequenceNumber.toString()
      };
    } catch (error) {
      this.logger.error('Failed to submit text message', error);
      return { success: false, error: error.message };
    }
  }
}

```

## ৪. মাইক্রোসার্ভিসে Text Message ব্যবহার (Usage in Events Service)

ধরা যাক, আপনার `events-service` মাইক্রোসার্ভিসে কোনো ইভেন্ট তৈরি হলে আপনি তার অডিট লগ বা টেক্সট Hedera-তে সেভ করতে চান।

**ফাইল:** `apps/events-service/src/events.controller.ts`

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { HederaService } from '@app/common'; 

@Controller('events')
export class EventsController {
  // আপনার নির্দিষ্ট Topic ID (সাধারণত ডাটাবেস বা .env থেকে আসবে)
  private readonly AUDIT_TOPIC_ID = '0.0.1234567'; 

  constructor(private readonly hederaService: HederaService) {}

  @Post('create')
  async createEvent(@Body() eventData: any) {
    // 1. আপনার ডাটাবেসে ইভেন্ট সেভ করার লজিক (e.g., MongoDB/Prisma)
    // const savedEvent = await this.db.save(eventData);

    // 2. Hedera-তে Immutable Text Log (JSON String) পাঠানো
    const logText = JSON.stringify({
      action: 'EVENT_CREATED',
      eventName: eventData.name,
      timestamp: new Date().toISOString(),
      creator: eventData.userId
    });

    const hederaResult = await this.hederaService.submitTextMessage(
      this.AUDIT_TOPIC_ID, 
      logText
    );

    return {
      message: 'Event created and logged on Hedera Blockchain',
      hederaConsensus: hederaResult
    };
  }
}

```

## -------- Exporting from Common Module ------------

`libs/common` ফোল্ডার থেকে ফাইলগুলো এক্সপোর্ট করতে ভুলবেন না।

**ফাইল:** `libs/common/src/hedera/hedera.module.ts`

import { Module } from '@nestjs/common';
import { HederaService } from './hedera.service';
import { HederaMirrorService } from './hedera-mirror.service';

@Module({
  providers: [HederaService, HederaMirrorService],
  exports: [HederaService, HederaMirrorService],
})
export class HederaModule {}


<!-- **ফাইল:**  -->

export * from './hedera/hedera.module';
export * from './hedera/hedera.service';
export * from './hedera/hedera-mirror.service';

