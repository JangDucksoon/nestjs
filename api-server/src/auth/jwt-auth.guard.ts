import { ForbiddenException, Injectable, UnauthorizedException, type ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { EncryptionUtil } from "src/utils/EncryptionUtil";


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private readonly reflector: Reflector
    ) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const isValid = await super.canActivate(context);

        if (!isValid) {
            return false;
        }
        
        const requiredAuth = this.reflector.get<string[] | string>('auth', context.getHandler());
        const request = context.switchToHttp().getRequest();
        const user = request?.user;
        const decryptedSessionId = EncryptionUtil.decrypt(user.sessionId);
        
        if (!user?.sessionId) return false;
        if (request.sessionID !== decryptedSessionId) {
            throw new UnauthorizedException("different sessionID");
        }

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