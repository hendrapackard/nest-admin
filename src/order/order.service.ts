import {Injectable} from '@nestjs/common';
import {AbstractService} from "../common/abstract.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Order} from "./models/order.entity";
import {Repository} from "typeorm";
import {PaginatedResult} from "../common/paginated-result.interface";

@Injectable()
export class OrderService extends AbstractService {
    constructor(
        @InjectRepository(Order) private readonly orderRepository: Repository<Order>
    ) {
        super(orderRepository);
    }

    async paginate(page = 1, relations = []): Promise<PaginatedResult> {
        const {data, meta} = await super.paginate(page, relations);

        return {
            data: data.map((order: Order) => ({
                id: order.id,
                name: order.name,
                email: order.email,
                total: order.total,
                created_at: order.created_at,
                order_items: order.order_items
            })),
            meta
        }
    }

    async chart() {
        return this.orderRepository.createQueryBuilder('o')
            .select(['date(o.created_at) as date', 'sum(oi.price * oi.quantity) as sum'])
            .innerJoin('order_items', 'oi', 'o.id = oi.order_id')
            .groupBy('o.created_at')
            .getRawMany();
    }
}
