import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/shared/prisma.service';
import { BlockchainService } from 'src/shared/blockhain.service';
import { Address } from 'viem';
import { StringUtilService } from 'src/shared/string-util.service';
import { SaltedOrderDto } from './dto/salted-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly blockchainService: BlockchainService,
    private readonly stringUtilService: StringUtilService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<SaltedOrderDto> {
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
      maker: order.maker,
      makerToken: order.makerToken,
      makerAmount: order.makerAmount.toString(),
      takerToken: order.takerToken,
      takerAmount: order.takerAmount.toString(),
      salt: order.salt,
    };
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
