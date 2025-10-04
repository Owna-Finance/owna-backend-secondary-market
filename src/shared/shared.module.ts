import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { BlockchainService } from './blockhain.service';
import { StringUtilService } from './string-util.service';

@Module({
  providers: [PrismaService, BlockchainService, StringUtilService],
  exports: [PrismaService, BlockchainService, StringUtilService],
})
export class SharedModule {}
