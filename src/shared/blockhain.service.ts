import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  Address,
  erc20Abi,
  createPublicClient,
} from 'viem';

@Injectable()
export class BlockchainService {
  constructor(
    @Inject('PUBLIC_CLIENT') private readonly client: ReturnType<typeof createPublicClient>,
  ) {}

  getPublicClient() {
    return this.client;
  }

  async getDecimalsERC20(address: Address): Promise<number> {
    try {
      const decimals = await this.client.readContract({
        address: address,
        abi: erc20Abi,
        functionName: 'decimals',
      });

      return decimals;
    } catch (error) {
      throw new BadRequestException(
        `Failed to get decimals for token at address ${address}. Please ensure this is a valid ERC20 contract address on Base Sepolia testnet.`,
      );
    }
  }
}
