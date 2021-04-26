import {Module} from '@nestjs/common';
import {UserModule} from './user/user.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from './auth/auth.module';
import {CommonModule} from './common/common.module';
import {RoleModule} from './role/role.module';
import {PermissionModule} from './permission/permission.module';
import {ProductModule} from './product/product.module';
import {OrderModule} from './order/order.module';
import {APP_GUARD} from "@nestjs/core";
import {PermissionGuard} from "./permission/permission.guard";

@Module({
    imports: [
        UserModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'postgres',
            port: 5432,
            username: 'nest_admin_user',
            password: 'nest_admin_password',
            database: 'nest_admin',
            autoLoadEntities: true,
            synchronize: true,
        }),
        AuthModule,
        CommonModule,
        RoleModule,
        PermissionModule,
        ProductModule,
        OrderModule
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: PermissionGuard
        }
    ]
})
export class AppModule {
}
