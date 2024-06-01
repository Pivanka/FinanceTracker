import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
    private authService: AuthService,
  ) { }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    if (!this.authService.IsLogIn()) {
      this.router.navigateByUrl("/auth/login");
      return of(false);
    }
    return of(true);
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    if (this.authService.IsLogIn()) {
      if (state.url == '/') {return of(this.router.createUrlTree(['/dashboard']));}
    }
    return of(true)
  }
}

export const canActivate: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.IsLogIn()) {
    router.navigateByUrl("/auth/login");
    return of(false);
  }

  if (state.url === '/') {
    console.log('hejskdjkfd')
    return of(router.createUrlTree(['/dashboard']));
  }

  return of(true)
};

export const canActivateChild: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => canActivate(route, state);
