import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/shared/prisma.service';
import { BlockchainService } from 'src/shared/blockhain.service';
import { Address } from 'viem';
import { StringUtilService } from 'src/shared/string-util.service';
import { UnsignedTypedDataDto } from './dto/unsigned-typed-data.dto';
import { baseSepolia } from 'viem/chains';
import { ConfigService } from '@nestjs/config';
import { OrderStatus } from '@prisma/client';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PaginatedOrdersResponseDto } from './dto/paginated-orders-response.dto';
import { SignedTypedDataResponseDto } from './dto/signed-typed-data-response.dto';

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

    let makerTokenDecimals: number;
    let takerTokenDecimals: number;

    try {
      [makerTokenDecimals, takerTokenDecimals] = await Promise.all([
        this.blockchainService.getDecimalsERC20(makerToken),
        this.blockchainService.getDecimalsERC20(takerToken),
      ]);
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch token decimals: ${error.message}`,
      );
    }

    let order;
    try {
      order = await this.prismaService.orders.create({
        data: {
          ...createOrderDto,
          makerTokenDecimals: makerTokenDecimals,
          takerTokenDecimals: takerTokenDecimals,
          salt: this.stringUtilService.generateSalt(),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create order: ${error.message}`,
      );
    }

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

  async verifySignedOrder(
    order: UnsignedTypedDataDto,
    signature: string,
  ): Promise<boolean> {
    const { account, domain, types, primaryType, message } = order;

    // Validate signature format
    if (!signature || !signature.match(/^0x[a-fA-F0-9]{130}$/)) {
      throw new BadRequestException('Invalid signature format');
    }

    // Check if order exists and is in correct state
    const existingOrder = await this.prismaService.orders.findUnique({
      where: { salt: message.salt },
    });

    if (!existingOrder) {
      throw new NotFoundException('Order not found');
    }

    if (existingOrder.status !== OrderStatus.PENDING_SIGNATURE) {
      throw new BadRequestException(
        `Order is not pending signature. Current status: ${existingOrder.status}`,
      );
    }

    // Verify signature
    let valid: boolean;
    try {
      valid = await this.blockchainService
        .getPublicClient()
        .verifyTypedData({
          address: account,
          domain: domain,
          types: types,
          primaryType: primaryType,
          message: message,
          signature: signature as `0x${string}`,
        });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to verify signature: ${error.message}`,
      );
    }

    if (!valid) {
      throw new BadRequestException('Invalid signature');
    }

    // Update order only if signature is valid
    try {
      await this.prismaService.orders.update({
        where: {
          salt: message.salt,
        },
        data: {
          status: OrderStatus.ACTIVE,
          signature: signature,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update order: ${error.message}`,
      );
    }

    return valid;
  }

  async executeOrder(orderId: number): Promise<SignedTypedDataResponseDto> {
    // Validate orderId
    if (!orderId || orderId <= 0) {
      throw new BadRequestException('Invalid order ID');
    }

    let order;
    try {
      order = await this.prismaService.orders.findUnique({
        where: {
          id: orderId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch order: ${error.message}`,
      );
    }

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.status !== OrderStatus.ACTIVE) {
      throw new BadRequestException(
        `Order is not active. Current status: ${order.status}`,
      );
    }
    if (!order.signature) {
      throw new BadRequestException('Order is not signed');
    }

    return {
      signature: order.signature,
      typedData: {
        account: order.maker as Address,
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
      },
    };
  }

  async getOrders(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedOrdersResponseDto> {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    try {
      const [data, total] = await Promise.all([
        this.prismaService.orders.findMany({
          skip,
          take: limit,
          where: {
            status: OrderStatus.ACTIVE,
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prismaService.orders.count({
          where: {
            status: OrderStatus.ACTIVE,
          },
        }),
      ]);

      return {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch orders: ${error.message}`,
      );
    }
  }
}
