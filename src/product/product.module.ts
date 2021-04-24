import {Module} from '@nestjs/common';
import {ProductController} from './product.controller';
import {ProductService} from './product.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Product} from "./models/product.entity";
import {CommonModule} from "../common/common.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Product]),
        CommonModule
    ],
    controllers: [ProductController],
    providers: [ProductService]
})
export class ProductModule {
}
