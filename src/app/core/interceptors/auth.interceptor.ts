// our app has token based authentication.
// this means that when the user signs up or logs in a jwt is issued to the user
// this jwt is stored in the client side
// and then its sent with subsequent requests.

import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // this is a pure function
  // we pass the reference to our request and it uses that reference to make a new copy of that request
  // this new copy will have new headers
  // and then will be passed to the API
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const excludedRoutes = [
      '/auth/login',
      '/auth/register',
    ];

    if (excludedRoutes.some((route) => req.url.includes(route))) {
      console.log('interceptor skipped : no token added');
      return next.handle(req);
    }

    const token = localStorage.getItem('authToken'); // Corrigé le nom de la clé

    if (token) {
      const newHeaders = req.headers
        .set('Authorization', `Bearer ${token}`);
      const modifiedRequest = req.clone({ headers: newHeaders });
      return next.handle(modifiedRequest);
    }

    return next.handle(req);
  }
}
