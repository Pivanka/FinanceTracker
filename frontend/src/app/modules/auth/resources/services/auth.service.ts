import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { LoginResult } from '../models/login-result';
import { TokenRequest } from '../models/token-request';
import { ACCES_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../models/tokens';
import { ApiService } from '../../../../core/resources/services/api.service';
import { SignalRService } from '../../../../core/resources/services/signalR.service';

@Injectable({
  providedIn: "root",
})
export class AuthService extends ApiService {
  constructor(
    http: HttpClient,
    private signalRService: SignalRService
  ) {
    super(http);
  }

  GetToken():string|null{
    return localStorage.getItem(ACCES_TOKEN_KEY);
  }

  IsLogIn():boolean{
    return !!localStorage.getItem(ACCES_TOKEN_KEY) && !!localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  LogIn(loginResult:LoginResult){
    localStorage.setItem(ACCES_TOKEN_KEY, loginResult.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, loginResult.refreshToken);
  }

  LogOut(){
    localStorage.removeItem(ACCES_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  RefreshTokens():Observable<LoginResult>{
    var token =  localStorage.getItem(ACCES_TOKEN_KEY);
    var refreshToken =  localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!token || !refreshToken){
      throwError(() => 1);
    }
    var params:TokenRequest = {accessToken:token??"", refreshToken:refreshToken??""};
    return this.post<LoginResult>("/api/Auth/refresh-token", params);
  }

  public isAuthenticated(): Promise<boolean> {
    const token = localStorage.getItem(ACCES_TOKEN_KEY);
    return Promise.resolve(!!token); // Simple check; consider decoding and validating token
  }
}
