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
import { OptimizeBudgetRequest, OptimizeBudgetResult, OptimizeRequestItem, RequirementType } from '../resources/models/optimizing-budget';
import { optimizeBudget } from '../resources/state/reports.actions';
import { selectOptimizingChart } from '../resources/state/reports.selectors';

export interface RequirementItem {
  category: any,
  amount: number,
  type: string
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

  constructor(private store: Store<AppState>, private fb: FormBuilder) { }

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
    this.items = new FormArray([
      this.addItemFormGroup()
    ])
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
      type: new FormControl(item?.type ?? 'min', Validators.required),
      amount: new FormControl(item?.amount?.toString() ?? '', [Validators.required, Validators.pattern('^[1-9]\\d*(\\.\\d+)?$')]),
    });
    return group;
  }

  removeItemFormGroup(i: number) {
    this.items!.removeAt(i);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.log(this.form)
      return;
    }

    const resultItems : OptimizeRequestItem[] = this.items!.value.map((item: RequirementItem) => {
      let newItem: OptimizeRequestItem = {
        amount: item.amount,
        type: item.type === 'min' ? RequirementType.Min : RequirementType.Max
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
