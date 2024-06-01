import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SharedModule } from '../../shared/shared.module';
import { PasswordSettingsComponent } from './password-settings/password-settings.component';
import { ChangePasswordModalComponent } from './password-settings/change-password-modal/change-password-modal.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as SettingsReducer from './resources/state/settings.reducer';
import { SettingsEffects } from './resources/state/settings.effects';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { EditProfileModalComponent } from './profile-settings/edit-profile-modal/edit-profile-modal.component';
import { CurrencySettingsComponent } from './currency-settings/currency-settings.component';
import { ChangeCurrencyModalComponent } from './currency-settings/change-currency-modal/change-currency-modal.component';

@NgModule({
  imports: [
    StoreModule.forFeature(
      SettingsReducer.settingsFeatureKey,
      SettingsReducer.reducer
    ),
    EffectsModule.forFeature([SettingsEffects]),
    CommonModule,
    SharedModule
  ],
  declarations: [
    SettingsComponent,
    PasswordSettingsComponent,
    ChangePasswordModalComponent,
    ProfileSettingsComponent,
    EditProfileModalComponent,
    CurrencySettingsComponent,
    ChangeCurrencyModalComponent,
  ]
})
export class SettingsModule { }
