import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {UserModule} from "../user/user.module";
import {CommonModule} from "../common/common.module";
import {RoleModule} from "../role/role.module";

@Module({
    imports: [
        UserModule,
        RoleModule,
        CommonModule
    ],
    controllers: [AuthController]
})
export class AuthModule {
}
