import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the token from the auth service
    const token = localStorage.getItem('authToken');
    // Clone the request and set the Authorization header if the token exists
    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    } else if (req.url.match(/\/ActualizarUsuario\/[\d]+/i) !== null && req.method === 'PUT' ||
        req.url.match(/\/ConsultarUsuario/i) !== null && req.method === 'GET') {
      const temporalToken = localStorage.getItem('tempToken');
      if (temporalToken) {
        authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${temporalToken}`
          }
        });
      }
    }

    // Pass the cloned request instead of the original request to the next handler
    return next.handle(authReq);
  }
}
