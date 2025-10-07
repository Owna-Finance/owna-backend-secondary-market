import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UnsignedTypedDataDto } from './dto/unsigned-typed-data.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PaginatedOrdersResponseDto } from './dto/paginated-orders-response.dto';
import { SignedTypedDataResponseDto } from './dto/signed-typed-data-response.dto';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody,
  ApiParam,
  ApiQuery
} from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('')
  @ApiOperation({ 
    summary: 'Create a new order',
    description: 'Creates a new order and returns unsigned typed data for signing'
  })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Order created successfully. Returns unsigned typed data to be signed by the maker.',
    type: UnsignedTypedDataDto 
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<UnsignedTypedDataDto> {
    return await this.ordersService.create(createOrderDto);
  }

  @Post('verify')
  @ApiOperation({ 
    summary: 'Verify a signed order',
    description: 'Verifies the signature of a signed order'
  })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        order: { 
          type: 'object',
          description: 'The unsigned typed data'
        },
        signature: { 
          type: 'string',
          description: 'The signature to verify',
          example: '0x...'
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Order signature verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid signature or order data' })
  async verifySignedOrder(
    @Body() order: UnsignedTypedDataDto,
    @Body() signature: string,
  ) {
    return await this.ordersService.verifySignedOrder(order, signature);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get paginated list of orders',
    description: 'Retrieves a paginated list of all orders'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10, max: 100)' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of orders retrieved successfully',
    type: PaginatedOrdersResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Invalid pagination parameters' })
  async getOrders(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedOrdersResponseDto> {
    return await this.ordersService.getOrders(paginationQuery);
  }

  @Get(':orderId/execute')
  @ApiOperation({ 
    summary: 'Execute an order',
    description: 'Executes an order by its ID and returns the signed typed data'
  })
  @ApiParam({ name: 'orderId', description: 'The ID of the order to execute', type: String })
  @ApiResponse({ 
    status: 200, 
    description: 'Order executed successfully. Returns signed typed data.',
    type: SignedTypedDataResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 400, description: 'Invalid order ID' })
  async executeOrder(
    @Param('orderId') orderId: string,
  ): Promise<SignedTypedDataResponseDto> {
    return await this.ordersService.executeOrder(+orderId);
  }
}
