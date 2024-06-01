import { Store } from "@ngrx/store";
import { AuthService } from "./modules/auth/resources/services/auth.service";
import * as SignalRActions from "./store/actions/signalR.actions";


export function initApp(store: Store, authService: AuthService) {
  return () => {
    return authService.isAuthenticated().then(isAuthenticated => {
      if (isAuthenticated) {
        store.dispatch(SignalRActions.connectSignalR());
      }
    });
  };
}
