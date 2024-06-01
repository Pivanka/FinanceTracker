import { Component, Input, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../store';
import { openDeleteCategoryConfirmModal, openEditCategoryModal } from '../../../../store/actions/modal.actions';
import { Observable, map } from 'rxjs';
import { Role } from '../../../auth/resources/models/role';
import { selectRole } from '../../../settings/resources/state/settings.selector';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.scss']
})
export class CategoryItemComponent implements OnInit {

  @Input() model!: any;
  hasUpdatingAccess$!: Observable<boolean | null>;
  hasDeletingAccess$!: Observable<boolean | null>;
  hasNoAccess$!: Observable<boolean | null>;

  constructor(private store: Store<AppState>) {
    this.hasUpdatingAccess$ = this.store.pipe(select(selectRole)).pipe(
      map(role => role == Role.Admin || role == Role.Manager)
    );
    this.hasDeletingAccess$ = this.store.pipe(select(selectRole)).pipe(
      map(role => role == Role.Admin)
    );
    this.hasNoAccess$ = this.store.pipe(select(selectRole)).pipe(
      map(role => role == Role.Empty || role == Role.Viewer)
    );
  }

  ngOnInit(): void { }

  openEditModal() {
    this.store.dispatch(openEditCategoryModal({ category: this.model }));
  }

  onDeleteClick() {
    this.store.dispatch(openDeleteCategoryConfirmModal({ category: this.model }))
  }
}
