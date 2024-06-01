import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ShellComponent } from './core/modules/shell/shell.component';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from './shared/shared.module';
import { MenuLinkComponent } from './core/modules/menu/menu-link/menu-link.component';
import { MenuComponent } from './core/modules/menu/menu.component';
import { AuthModule } from './modules/auth/auth.module';
import { AuthInterceptorService } from './modules/auth/resources/services/auth-interceptor.service';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GeneralModule } from './modules/general/general.module';
import { SettingsModule } from './modules/settings/settings.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { Store, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { metaReducers, reducers } from './store';
import { SpinnerEffects } from './store/effects/spinner.effects';
import { AlertEffects } from './store/effects/alert.effects';
import { RouteEffects } from './store/effects/route.effects';
import { ModalEffects } from './store/effects/modal.effects';
import { AuthEffects } from './store/effects/auth.effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { ReportsModule } from './modules/reports/reports.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '../environments/environment';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { initApp } from './app.initializer';
import { AuthService } from './modules/auth/resources/services/auth.service';
import { SignalREffects } from './store/effects/signalR.effects';
import { CustomErrorHandler } from './core/resources/services/custom-error-handler.service';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    RouterModule.forRoot(routes),
    SharedModule,
    AuthModule,
    HttpClientModule,
    DashboardModule,
    BrowserAnimationsModule,
    GeneralModule,
    SettingsModule,
    ReportsModule,
    TransactionsModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true,
        strictActionWithinNgZone: true,
        strictActionTypeUniqueness: true,
      }
    }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([
      AuthEffects,
      SpinnerEffects,
      AlertEffects,
      RouteEffects,
      ModalEffects,
      SignalREffects
    ])
  ],
  declarations: [
    AppComponent,
    ShellComponent,
    MenuComponent,
    MenuLinkComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [Store, AuthService],
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: CustomErrorHandler
    },
  ],
  exports: [RouterModule]
})
export class AppModule { }
