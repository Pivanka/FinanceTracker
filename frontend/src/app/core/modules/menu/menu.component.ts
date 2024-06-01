import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ProfileSettingsModel } from '../../../modules/settings/resources/models/profile-settings';
import { loadUserSettings } from '../../../modules/settings/resources/state/settings.actions';
import { selectProfileSettings } from '../../../modules/settings/resources/state/settings.selector';
import { AppState } from '../../../store';
import { logout } from '../../../store/actions/auth.actions';
import { SignalRService } from '../../resources/services/signalR.service';
import { isUnreadNotififcations } from '../../../modules/dashboard/resources/state/dashboard.actions';
import { selectAnyUnredNotification } from '../../../modules/dashboard/resources/state/dashboard.selectors';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {

  profile$?:Observable<ProfileSettingsModel | null>
  isNotificationReceived = false;
  isUnread$!: Subscription;

  constructor(private store: Store<AppState>, private signalRService: SignalRService) { }

  ngOnInit() {
    this.store.dispatch(loadUserSettings());
    this.store.dispatch(isUnreadNotififcations());
    this.profile$ = this.store.pipe(select(selectProfileSettings));

    this.signalRService.addNotificationListener(() => {
      this.isNotificationReceived = true
    });

    this.isUnread$ = this.store.select(selectAnyUnredNotification)
      .subscribe(isUnread => {
        this.isNotificationReceived = isUnread
      });
  }

  logout() {
    this.store.dispatch(logout());
  }
  ngOnDestroy(): void {
    this.isUnread$.unsubscribe();
  }
}
