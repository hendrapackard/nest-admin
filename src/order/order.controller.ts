import {ClassSerializerInterceptor, Controller, Get, Query, UseGuards, UseInterceptors} from '@nestjs/common';
import {OrderService} from "./order.service";
import {AuthGuard} from "../auth/auth.guard";

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller()
export class OrderController {
    constructor(private orderService: OrderService) {
    }

    @Get('orders')
    async all(@Query('page') page = 1) {
        return this.orderService.paginate(page, ['order_items']);
    }
}
