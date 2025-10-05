import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UnsignedTypedDataDto } from './dto/unsigned-typed-data.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PaginatedOrdersResponseDto } from './dto/paginated-orders-response.dto';

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

  @Get()
  async getOrders(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedOrdersResponseDto> {
    return await this.ordersService.getOrders(paginationQuery);
  }
}
