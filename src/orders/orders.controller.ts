import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UnsignedTypedDataDto } from './dto/unsigned-typed-data.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PaginatedOrdersResponseDto } from './dto/paginated-orders-response.dto';
import { SignedTypedDataResponseDto } from './dto/signed-typed-data-response.dto';

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

  @Get(':orderId/execute')
  async executeOrder(
    @Param('orderId') orderId: string,
  ): Promise<SignedTypedDataResponseDto> {
    return await this.ordersService.executeOrder(+orderId);
  }
}
