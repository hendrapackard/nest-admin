import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Observable} from 'rxjs';
import {Reflector} from "@nestjs/core";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {
  }

  canActivate(
      context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const access = this.reflector.get<string>('access', context.getHandler());
    console.log(access)
    return true;
  }
}
