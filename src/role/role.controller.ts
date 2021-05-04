import {BadRequestException, Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {RoleService} from "./role.service";
import {Not} from "typeorm";
import {RoleCreateDto} from "./models/role-create.dto";
import {HasPermission} from "../permission/has-permission.decorator";

@Controller('roles')
export class RoleController {
    constructor(private roleService: RoleService) {
    }

    @Get()
    @HasPermission('roles')
    async all() {
        return this.roleService.paginate();
    }

    @Post()
    @HasPermission('roles')
    async create(@Body() body: RoleCreateDto) {
        if (await this.roleService.findOne({name: body.name})) {
            throw new BadRequestException(['name has already been taken']);
        }

        return this.roleService.create({
            name: body.name,
            permissions: body.permissions.map(id => ({id}))
        })
    }

    @Get(':id')
    @HasPermission('roles')
    async get(@Param('id') id: number) {
        return this.roleService.findOneOrNotFound({id}, ['permissions']);
    }

    @Put(':id')
    @HasPermission('roles')
    async update(
        @Param('id') id: number,
        @Body() body: RoleCreateDto
    ) {
        await this.roleService.findOneOrNotFound({id});

        if (await this.roleService.findOne({name: body.name, id: Not(id)})) {
            throw new BadRequestException(['name has already been taken']);
        }

        await this.roleService.update(id, {
            name: body.name
        });

        const data = await this.roleService.findOne({id});

        return this.roleService.create({
            ...data,
            permissions: body.permissions.map(id => ({id}))
        });
    }

    @Delete(':id')
    @HasPermission('roles')
    async delete(@Param('id') id: number) {
        const data = await this.roleService.findOneOrNotFound({id});

        await this.roleService.delete(id);

        return data;
    }
}
