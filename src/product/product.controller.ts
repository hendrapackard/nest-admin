import {BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {ProductService} from "./product.service";
import {AuthGuard} from "../auth/auth.guard";
import {ProductCreateDto} from "./models/product-create.dto";
import {Not} from "typeorm";

@UseGuards(AuthGuard)
@Controller('products')
export class ProductController {
    constructor(private productService: ProductService) {
    }

    @Get()
    async all(@Query('page') page = 1) {
        return this.productService.paginate(page);
    }

    @Post()
    async create(@Body() body: ProductCreateDto) {
        if (await this.productService.findOne({title: body.title})) {
            throw new BadRequestException(['title has already been taken']);
        }

        return this.productService.create(body);
    }

    @Get(':id')
    async get(@Param('id') id: number) {
        return this.productService.findOneOrNotFound({id});
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() body: ProductCreateDto
    ) {
        await this.productService.findOneOrNotFound({id});

        if (await this.productService.findOne({title: body.title, id: Not(id)})) {
            throw new BadRequestException(['title has already been taken']);
        }

        await this.productService.update(id, body);

        return this.productService.findOne({id});
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        const data = await this.productService.findOneOrNotFound({id});

        await this.productService.delete(id);

        return data;
    }
}
