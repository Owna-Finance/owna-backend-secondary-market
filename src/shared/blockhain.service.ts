import { Injectable } from '@nestjs/common';
import { Address, createPublicClient, erc20Abi, http } from 'viem';
import { baseSepolia } from 'viem/chains';

@Injectable()
export class BlockchainService {
  client = createPublicClient({ chain: baseSepolia, transport: http() });

  getPublicClient() {
    return this.client;
  }

  async getDecimalsERC20(address: Address): Promise<number> {
    const decimals = await this.client.readContract({
      address: address,
      abi: erc20Abi,
      functionName: 'decimals',
    });

    return decimals;
  }
}
