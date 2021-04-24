import {forwardRef, Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {UserModule} from "../user/user.module";
import {CommonModule} from "../common/common.module";
import {RoleModule} from "../role/role.module";
import {AuthService} from './auth.service';

@Module({
    imports: [
        forwardRef(() => UserModule),
        RoleModule,
        CommonModule
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {
}
