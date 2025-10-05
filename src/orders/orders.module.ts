import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { SharedModule } from 'src/shared/shared.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [SharedModule, ConfigModule],
})
export class OrdersModule {}
