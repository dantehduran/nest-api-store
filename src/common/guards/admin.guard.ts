import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '@prisma/client';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    if (!user) return false;
    if (user.username === 'admin') return true;
    throw new UnauthorizedException(
      'You are not authorized to access this resource',
    );
  }
}
