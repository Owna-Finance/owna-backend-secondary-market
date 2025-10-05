import { Controller, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UnsignedTypedDataDto } from './dto/unsigned-typed-data.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('create')
  async create(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<UnsignedTypedDataDto> {
    return await this.ordersService.create(createOrderDto);
  }

  @Post('verify')
  async verifySignedOrder(
    @Body() order: UnsignedTypedDataDto,
    @Body() signature: string,
  ) {
    return await this.ordersService.verifySignedOrder(order, signature);
  }
}
