import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/shared/prisma.service';
import { BlockchainService } from 'src/shared/blockhain.service';
import { Address } from 'viem';
import { StringUtilService } from 'src/shared/string-util.service';
import { UnsignedTypedDataDto } from './dto/unsigned-typed-data.dto';
import { baseSepolia } from 'viem/chains';
import { ConfigService } from '@nestjs/config';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly blockchainService: BlockchainService,
    private readonly stringUtilService: StringUtilService,
    private readonly configService: ConfigService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<UnsignedTypedDataDto> {
    const maker = createOrderDto.maker as Address;
    const makerToken = createOrderDto.makerToken as Address;
    const takerToken = createOrderDto.takerToken as Address;

    const [makerTokenDecimals, takerTokenDecimals] = await Promise.all([
      this.blockchainService.getDecimalsERC20(makerToken),
      this.blockchainService.getDecimalsERC20(takerToken),
    ]);

    const order = await this.prismaService.orders.create({
      data: {
        ...createOrderDto,
        makerTokenDecimals: makerTokenDecimals,
        takerTokenDecimals: takerTokenDecimals,
        salt: this.stringUtilService.generateSalt(),
      },
    });

    return {
      account: maker,
      domain: {
        name: 'Owna',
        version: '1',
        chainId: baseSepolia.id,
        verifyingContract: this.configService.getOrThrow<Address>(
          'SECONDARY_MARKET_CONTRACT_ADDRESS',
        ),
      },
      types: {
        Order: [
          { name: 'maker', type: 'address' },
          { name: 'makerToken', type: 'address' },
          { name: 'makerAmount', type: 'uint256' },
          { name: 'takerToken', type: 'address' },
          { name: 'takerAmount', type: 'uint256' },
          { name: 'salt', type: 'string' },
        ] as const,
      },
      primaryType: 'Order' as const,
      message: {
        maker: order.maker,
        makerToken: order.makerToken,
        makerAmount: order.makerAmount.toString(),
        takerToken: order.takerToken,
        takerAmount: order.takerAmount.toString(),
        salt: order.salt,
      },
    };
  }

  async verifySignedOrder(order: UnsignedTypedDataDto, signature: string) {
    const { account, domain, types, primaryType, message } = order;

    const valid = await this.blockchainService
      .getPublicClient()
      .verifyTypedData({
        address: account,
        domain: domain,
        types: types,
        primaryType: primaryType,
        message: message,
        signature: signature as `0x${string}`,
      });

    await this.prismaService.orders.update({
      where: {
        salt: message.salt,
      },
      data: {
        status: OrderStatus.ACTIVE,
        signature: signature,
      },
    });

    return valid;
  }
}
