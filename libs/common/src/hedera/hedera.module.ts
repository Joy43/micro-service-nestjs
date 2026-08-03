import { Module } from '@nestjs/common';
import { HederaService } from './hedera.service';
import { HederaMirrorService } from './hedera-mirror.service';

@Module({
  providers: [HederaService, HederaMirrorService],
  exports: [HederaService, HederaMirrorService],
})
export class HederaModule {}
