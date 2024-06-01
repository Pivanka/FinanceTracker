import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Category, CustomCategory } from '../../transactions/resources/models/category';
import { Observable } from 'rxjs';
import { selectCategories, selectCustomCategories } from '../../transactions/resources/state/transactions.selector';
import { TransactionType } from '../../dashboard/resources/models/transaction';
import { ButtonConfig } from '../../../shared/button/button.component';
import { AppState } from '../../../store';
import { openAddCategoryModal } from '../../../store/actions/modal.actions';
import { SignalRType } from '../../../shared/models/signalR-type';
import { SignalRService } from '../../../core/resources/services/signalR.service';
import { getCustomCategories } from '../../transactions/resources/state/transactions.actions';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  selected = -1;
  categories$?: Observable<Category[] | null>;
  customCategories$?: Observable<CustomCategory[] | null>;

  constructor(private store: Store<AppState>, private signalRService: SignalRService) { }

  ngOnInit() {
    this.categories$ = this.store.select(selectCategories)
    this.customCategories$ = this.store.select(selectCustomCategories)

    this.signalRService.addChangesListener((type: SignalRType) => {
      if(type === SignalRType.Category) {
        this.store.dispatch(getCustomCategories());
      }
    });
  }

  config: ButtonConfig = {
    text: "+ Add a custom category",
    onClick: undefined,
  }

  select(index: number): void{
    this.selected = index;
  }

  addCategory() {
    this.store.dispatch(openAddCategoryModal());
  }

  filterCategories(items: Category[], type: TransactionType) : Category[] {
    return items.filter(x => x.type === type);
  }

}
