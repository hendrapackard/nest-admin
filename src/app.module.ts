import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UserModule} from './user/user.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from './auth/auth.module';

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
        AuthModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
