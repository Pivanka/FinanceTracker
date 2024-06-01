import { Component, Input, OnInit } from '@angular/core';
import { TransactionType } from '../../../dashboard/resources/models/transaction';
import { Category, CustomCategory } from '../../../transactions/resources/models/category';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements OnInit {

  items!: {
    header: string,
    categories?: Observable<Category[] | CustomCategory[] | null>,
    expanded: boolean
  }[];

  @Input() categories?: Observable<Category[] | null>;
  @Input() customCategories?: Observable<CustomCategory[] | null>;

  constructor() { }

  ngOnInit(): void {
    this.items = [
      { header: 'Income Categories', categories: this.filterObservableCategories(this.categories!, TransactionType.Income), expanded: false },
      { header: 'Expense Categories', categories: this.filterObservableCategories(this.categories!, TransactionType.Expense), expanded: false },
      { header: 'Custom Categories', categories: this.customCategories, expanded: false }
    ];
  }

  toggleItem(item: any) {
    item.expanded = !item.expanded;
  }

  filterCategories(items: Category[], type: TransactionType) : Category[] {
    return items.filter(x => x.type === type);
  }
  filterObservableCategories(items: Observable<Category[] | null>, type: TransactionType): Observable<Category[] | null> {
    return items.pipe(
      map(categories => categories?.filter(category => category.type === type) ?? null)
    );
  }
}
