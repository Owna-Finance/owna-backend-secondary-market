import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [SharedModule],
})
export class OrdersModule {}
