import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';
import { Observable } from 'rxjs';
import { getCurrency } from '../../settings/resources/state/settings.actions';
import { selectCurrency } from '../../settings/resources/state/settings.selector';
import { ButtonConfig } from '../../../shared/button/button.component';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Category, CustomCategory } from '../../transactions/resources/models/category';
import { showCategoriesSelector, showCustomCategoriesSelector } from '../../transactions/resources/state/transactions.selector';
import { TransactionType } from '../../dashboard/resources/models/transaction';
import { getCategories, getCustomCategories } from '../../transactions/resources/state/transactions.actions';
import { OptimizeBudgetRequest, OptimizeBudgetResult, OptimizeRequestItem } from '../resources/models/optimizing-budget';
import { optimizeBudget } from '../resources/state/reports.actions';
import { selectError, selectOptimizingChart } from '../resources/state/reports.selectors';

export interface RequirementItem {
  category: any,
  maxAmount: number,
  minAmount: number,
}

@Component({
  selector: 'app-budget-optimizing',
  templateUrl: './budget-optimizing.component.html',
  styleUrls: ['./budget-optimizing.component.scss']
})
export class BudgetOptimizingComponent implements OnInit {

  addItemButtonConfig: ButtonConfig = { text: '+ Add Item', onClick: () => this.addItem(), disabled: false }
  submitButtonConfig: ButtonConfig = { text: 'Optimize', onClick: () => this.onSubmit(), disabled: false }
  currency$!: Observable<string | null>
  items: FormArray | null = null;
  categories$?: Observable<Category[] | undefined>;
  customCategories$?: Observable<CustomCategory[] | undefined>;
  form!: FormGroup;
  budget!: FormControl;
  optimizedBudget$!: Observable<OptimizeBudgetResult | null>;
  error$!: Observable<any | null>;
Math: any;

  constructor(private store: Store<AppState>, private fb: FormBuilder) {
    this.error$ = store.select(selectError);
  }

  ngOnInit() {
    this.store.dispatch(getCurrency());
    this.store.dispatch(getCategories());
    this.store.dispatch(getCustomCategories());
    this.currency$ = this.store.select(selectCurrency);
    this.categories$ = this.store.pipe(
      select(showCategoriesSelector(TransactionType.Expense, ''))
    );
    this.customCategories$ = this.store.pipe(
      select(showCustomCategoriesSelector(TransactionType.Expense, ''))
    )
    this.createFormControls();
    this.createForm();
    this.optimizedBudget$ = this.store.select(selectOptimizingChart);
  }

  createFormControls() {
    this.budget = new FormControl(null, [Validators.required, Validators.pattern('^[1-9]\\d*(\\.\\d+)?$')]);
    this.items = this.fb.array([])
  }

  createForm() {
    this.form = this.fb.group({
      budget: this.budget,
      items: this.items,
    });
  }

  addItem(item: any | undefined = undefined) {
    this.items!.push(this.addItemFormGroup(item));
  }

  addItemFormGroup(item: any | undefined = undefined): FormGroup {
    const group = this.fb.group({
      category: new FormControl(item?.category ?? '', Validators.required),
      maxAmount: new FormControl(item?.maxAmount ?? null, [Validators.pattern('^[1-9]\\d*(\\.\\d+)?$')]),
      minAmount: new FormControl(item?.maxAmount ?? null, [Validators.pattern('^[1-9]\\d*(\\.\\d+)?$')]),
    });
    return group;
  }

  removeItemFormGroup(i: number) {
    this.items!.removeAt(i);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const resultItems : OptimizeRequestItem[] = this.items!.value.map((item: RequirementItem) => {
      let newItem: OptimizeRequestItem = {
        maxAmount: item.maxAmount,
        minAmount: item.minAmount,
      }

      if(item.category.teamId > 0) {
        newItem.customCategoryId = item.category.id;
      } else {
        newItem.categoryId = item.category.id
      }

      return newItem
    });

    const result: OptimizeBudgetRequest = {
      budget: this.budget!.value,
      items: resultItems
    }

    console.log(result)
    this.store.dispatch(optimizeBudget({ request: result }));
  }
}
