import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { PrismaService } from './prisma.service';
import { BlockchainService } from './blockhain.service';
import { StringUtilService } from './string-util.service';

@Module({
  providers: [
    PrismaService,
    StringUtilService,
    {
      provide: 'PUBLIC_CLIENT',
      useFactory: (configService: ConfigService) => {
        return createPublicClient({
          chain: baseSepolia,
          transport: http(
            configService.get<string>('BASE_SEPOLIA_RPC_URL'),
          ),
        });
      },
      inject: [ConfigService],
    },
    BlockchainService,
  ],
  exports: [PrismaService, BlockchainService, StringUtilService],
})
export class SharedModule {}
