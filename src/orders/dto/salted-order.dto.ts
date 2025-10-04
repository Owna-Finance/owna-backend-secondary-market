import { CreateOrderDto } from './create-order.dto';

export class SaltedOrderDto extends CreateOrderDto {
  salt: string;
}
