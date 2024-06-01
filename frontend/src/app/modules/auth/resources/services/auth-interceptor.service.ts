import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, switchMap, throwError } from "rxjs";
import { AuthService } from "./auth.service";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { AppState } from "../../../../store";
import { loginFailure } from "../../../../store/actions/auth.actions";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService,
    private store: Store<AppState>,
    private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq = this.addTokenHeader(req, this.authService.GetToken() ?? "");
    return next.handle(authReq).pipe(
      catchError((error) => {
        if(error.status === 401 && this.authService.IsLogIn()){
          return this.handleRefreshToken(req,next);
        }
        if(error.status === 401){
          this.router.navigate(['/auth/login'])
          return throwError(() => error);
        }
          return throwError(() => error);
      })
    );
  }

  addTokenHeader(req: HttpRequest<any>, token:string):HttpRequest<any>{
    return req.clone({
      headers: req.headers.set('Authorization', "Bearer ".concat(token))
    });
  }

  handleRefreshToken(req: HttpRequest<any>, next: HttpHandler){
    return this.authService.RefreshTokens().pipe(
        switchMap((data) => {
          this.authService.LogIn(data);
          return next.handle(this.addTokenHeader(req,data.accessToken))
        })
        ,catchError((error) => {
          this.store.dispatch(loginFailure({error: ""}));
          return throwError(() => error);
        })
    );
  }
}
