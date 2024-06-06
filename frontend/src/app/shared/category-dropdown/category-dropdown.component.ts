import { AfterContentInit, Component, EventEmitter, Input, OnInit, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { Category, CustomCategory } from '../../modules/transactions/resources/models/category';
import { Store, select } from '@ngrx/store';
import { showCategoriesSelector, showCustomCategoriesSelector } from '../../modules/transactions/resources/state/transactions.selector';
import { AppState } from '../../store';
import { TransactionType } from '../../modules/dashboard/resources/models/transaction';

@Component({
  selector: 'app-category-dropdown',
  templateUrl: './category-dropdown.component.html',
  styleUrls: ['./category-dropdown.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CategoryDropdownComponent),
    multi: true
   }]
})
export class CategoryDropdownComponent implements OnInit, ControlValueAccessor, AfterContentInit  {
  @Input() categories?: Observable<Category[] | undefined>;
  @Input() customCategories?: Observable<CustomCategory[] | undefined>;
  @Input() type!: string;
  @Input() defaultValue?: any;
  @Output() selectedCategory = new EventEmitter<any>();
  isSelectListOpen: boolean = false;
  isSelected: boolean = false;
  searchString: string = "";

  private _value!: any;
  get value() {
   return this._value;
  }
  set value(val) {
    this._value = val;
    this._onChange(this._value);
  }

  constructor(
    private store: Store<AppState>) {
  }

  ngAfterContentInit(): void {
    if (this.defaultValue) {
      this.isSelected = true;
      this.isSelectListOpen = false;
      this.value = this.defaultValue;
    }
  }

  ngOnInit() {
  }

  private _onChange(_: any) { }
  public registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched() {}

  writeValue(value: any): void {
    this.value = value;
  }

  openSelectList() {
    this.isSelectListOpen = !this.isSelectListOpen;
    this.isSelected = false;
  }

  closeSelectList() {
    this.isSelectListOpen = false;
  }

  updateList(el: any){
    this.isSelected = true;
    this.isSelectListOpen = false;
    this.value = el;

    this.selectedCategory.emit(el);
  }

  newSearch(input: string): void {
    var transactionType = 'Expense' === this.type ? TransactionType.Expense : TransactionType.Income;

    this.categories = this.store.pipe(
      select(showCategoriesSelector(transactionType, input))
    );
    this.customCategories = this.store.pipe(
      select(showCustomCategoriesSelector(transactionType, input))
    )
  }

  clearSelection() {
    this.isSelected = false;
    this.isSelectListOpen = false;
    this.value = null;
  }
}
