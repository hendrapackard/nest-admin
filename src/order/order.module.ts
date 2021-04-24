import {Module} from '@nestjs/common';
import {OrderController} from './order.controller';
import {OrderService} from './order.service';
import {CommonModule} from "../common/common.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Order} from "./models/order.entity";
import {OrderItem} from "./models/order-item.entity";

@Module({
    imports: [
        CommonModule,
        TypeOrmModule.forFeature([Order, OrderItem])
    ],
    controllers: [OrderController],
    providers: [OrderService]
})
export class OrderModule {
}