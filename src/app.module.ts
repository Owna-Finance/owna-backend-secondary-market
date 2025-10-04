import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [ConfigModule.forRoot(), OrdersModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
