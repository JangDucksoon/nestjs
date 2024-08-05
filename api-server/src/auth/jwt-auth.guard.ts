import { ForbiddenException, Inject, Injectable, UnauthorizedException, type ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private readonly reflector: Reflector,
    ) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const isValid = await super.canActivate(context);
        if (!isValid) {
            return false;
        }
        
        const requiredAuth = this.reflector.get<string[] | string>('auth', context.getHandler())
        const request = context.switchToHttp().getRequest();
        const user = request?.user;
        const auth = user?.auth;

        if (requiredAuth) {
            if (typeof requiredAuth ==='string' && requiredAuth!== auth) {
                throw new ForbiddenException('Insufficient permissions');
            } else if (Array.isArray(requiredAuth) &&!requiredAuth.includes(auth)) {
                throw new ForbiddenException('Insufficient permissions');
            }
        }
        
        return true;
    }
}