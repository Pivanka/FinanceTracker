import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { select, Store } from "@ngrx/store";
import { ProfileSettingsModel } from '../resources/models/profile-settings';
import { selectProfileSettings } from '../resources/state/settings.selector';
import { openEditProfileModal } from '../../../store/actions/modal.actions';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit {

  profile$?:Observable<ProfileSettingsModel | null>

  constructor(private store$: Store) { }

  ngOnInit(): void {
    this.profile$ = this.store$.pipe(select(selectProfileSettings));
  }

  openModal(profile: ProfileSettingsModel) {
    this.store$.dispatch(openEditProfileModal({ profile: profile}))
  }

  selectImage(avatar:string|null) {
    let st = avatar ?? "assets/images/icons/avatar.svg";
    return `url('${st}')`;
  }
}
