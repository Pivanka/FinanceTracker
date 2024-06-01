import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { ButtonComponent } from './button/button.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { EmptyStateComponent } from './empty-state/empty-state.component';
import { FormContainerComponent } from './form-container/form-container.component';
import { GenericErrorMessageComponent } from './generic-error-message/generic-error-message.component';
import { HeaderComponent } from './header/header.component';
import { InputComponent } from './input/input.component';
import { ModalActionsContainerComponent } from './modal/modal-actions-container/modal-actions-container.component';
import { ModalContainerComponent } from './modal/modal-container/modal-container.component';
import { ModalSuccessComponent } from './modal/modal-success/modal-success.component';
import { ModalTitleComponent } from './modal/modal-title/modal-title.component';
import { SuccessModalRedirectComponent } from './modal/success-modal-redirect/success-modal-redirect.component';
import { PaginationComponent } from './pagination/pagination.component';
import { PlaceholderComponent } from './placeholder/placeholder.component';
import { SearchInputComponent } from './search-input/search-input.component';
import { SortDropdownComponent } from './sort-dropdown/sort-dropdown.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { TableHeaderCellComponent } from './table/table-header-cell/table-header-cell.component';
import { TableHeaderComponent } from './table/table-header/table-header.component';
import { TableRowCellComponent } from './table/table-row-cell/table-row-cell.component';
import { TableRowComponent } from './table/table-row/table-row.component';
import { TabComponent } from './tabs/tab/tab.component';
import { TabsComponent, Tab } from './tabs/tabs.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EnumPipe } from './pipes/enum.pipe';
import { FailedModalRedirectComponent } from './modal/failed-modal-redirect/failed-modal-redirect.component';
import { ModalFailedComponent } from './modal/modal-failed/modal-failed.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
  ],
  declarations: [
    HeaderComponent,
    AboutUsComponent,
    InputComponent,
    ButtonComponent,
    EmptyStateComponent,
    FormContainerComponent,
    GenericErrorMessageComponent,
    TabComponent,
    TabsComponent,
    Tab,
    ModalContainerComponent,
    ModalTitleComponent,
    ModalActionsContainerComponent,
    CheckboxComponent,
    TableHeaderCellComponent,
    TableHeaderComponent,
    TableRowCellComponent,
    TableRowComponent,
    SearchInputComponent,
    DropdownComponent,
    SpinnerComponent,
    PlaceholderComponent,
    SortDropdownComponent,
    PaginationComponent,
    SuccessModalRedirectComponent,
    ModalSuccessComponent,
    EnumPipe,
    ModalFailedComponent,
    FailedModalRedirectComponent,
  ],
  exports: [
    HeaderComponent,
    AboutUsComponent,
    InputComponent,
    ButtonComponent,
    EmptyStateComponent,
    FormContainerComponent,
    GenericErrorMessageComponent,
    TabComponent,
    TabsComponent,
    Tab,
    ModalContainerComponent,
    ModalTitleComponent,
    ModalActionsContainerComponent,
    CheckboxComponent,
    TableHeaderCellComponent,
    TableHeaderComponent,
    TableRowCellComponent,
    TableRowComponent,
    SearchInputComponent,
    DropdownComponent,
    SpinnerComponent,
    PlaceholderComponent,
    SortDropdownComponent,
    PaginationComponent,
    SuccessModalRedirectComponent,
    ModalSuccessComponent,
    EnumPipe,
    ModalFailedComponent,
    FailedModalRedirectComponent,
  ]
})
export class SharedModule { }
