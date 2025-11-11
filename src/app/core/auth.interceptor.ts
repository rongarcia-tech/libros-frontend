// Http Interceptor que añade Authorization si existe en AuthService
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const header = this.auth.getAuthorizationHeader();

    // Si no hay credenciales, pasar la petición tal cual
    if (!header) {
      return next.handle(req);
    }

    // No duplicar si ya existe Authorization
    if (req.headers.has('Authorization')) {
      return next.handle(req);
    }

    const headers = req.headers.set('Authorization', header);
    const cloned = req.clone({ headers });
    return next.handle(cloned);
  }
}
