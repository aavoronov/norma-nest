import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common/interfaces';
import { Observable, tap } from 'rxjs';

export class AppendCountHeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const now = Date.now();
    return (
      next
        .handle()
        //   .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
        .pipe(
          tap(() => {
            const res = context.switchToHttp().getResponse();
            // console.log('res', res);
            res.header('foo', 'bar');
            console.log(`After... ${Date.now() - now}ms`);
          }),
        )
    );
  }
}
