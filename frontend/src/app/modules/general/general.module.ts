import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralComponent } from './general.component';
import { MembersComponent } from './members/members.component';
import { MemberComponent } from './members/member/member.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { AddMemberModalComponent } from './members/add-member-modal/add-member-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as GeneralReducer from './resources/state/general.reducer';
import { GeneralEffects } from './resources/state/general.effects';
import { AccountsComponent } from './accounts/accounts.component';
import { AccountItemComponent } from './accounts/account-item/account-item.component';
import { AddAccountModalComponent } from './accounts/add-account-modal/add-account-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditAccountModalComponent } from './accounts/edit-account-modal/edit-account-modal.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryItemComponent } from './categories/category-item/category-item.component';
import { AddCategoryModalComponent } from './categories/add-category-modal/add-category-modal.component';
import { EditCategoryModalComponent } from './categories/edit-category-modal/edit-category-modal.component';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { AccordionComponent } from './categories/accordion/accordion.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { DeleteAccountConfirmModalComponent } from './accounts/delete-account-confirm-modal/delete-account-confirm-modal.component';
import { DeleteCategoryConfirmModalComponent } from './categories/delete-category-confirm-modal/delete-category-confirm-modal.component';
import { MatFormFieldModule } from '@angular/material/form-field';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'members',
    pathMatch: 'full'
  },
  {
    path: '',
    component: GeneralComponent,
    children: [
      { path: 'members', component: MembersComponent },
      { path: 'accounts', component: AccountsComponent },
      { path: 'categories', component: CategoriesComponent}
    ],
  },
];

@NgModule({
  imports: [
    StoreModule.forFeature(
      GeneralReducer.generalFeatureKey,
      GeneralReducer.reducer
    ),
    EffectsModule.forFeature([GeneralEffects]),
    CommonModule,
    SharedModule,
    MatDialogModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    CdkAccordionModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
  ],
  declarations: [
    GeneralComponent,
    MembersComponent,
    MemberComponent,
    AddMemberModalComponent,
    AccountsComponent,
    AccountItemComponent,
    AddAccountModalComponent,
    EditAccountModalComponent,
    CategoriesComponent,
    CategoryItemComponent,
    AddCategoryModalComponent,
    EditCategoryModalComponent,
    AccordionComponent,
    DeleteAccountConfirmModalComponent,
    DeleteCategoryConfirmModalComponent,
  ]
})
export class GeneralModule { }
