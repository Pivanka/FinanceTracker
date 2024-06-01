import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() currentPage = 1;
  @Input() totalCount = 0;
  @Input() siblingCount = 1;
  @Input() pageSize = 3;
  @Output() onPageChange: EventEmitter<number> = new EventEmitter();
  totalPageCount = () => Math.ceil(this.totalCount / this.pageSize);
  DOTS: string = '...';
  list: (number | string)[] = [];
  showing:string = '';

  public onPage(page: number | string) {
    if (typeof page === 'number'){
      this.onPageChange.emit(page);

      this.currentPage = page;
      this.list = this.paginate();
      this.showing = this.setShowing();
    }
  }

  ngOnInit(): void {
    this.list = this.paginate();
    this.showing = this.setShowing();
  }

  private paginate(): (number | string)[]{
    const totalPageNumbers = this.siblingCount + 5;

    if (totalPageNumbers >= this.totalPageCount()) {
      return this.range(1, this.totalPageCount());
    }

    const leftSiblingIndex = Math.max(this.currentPage - this.siblingCount, 1);
    const rightSiblingIndex = Math.min(this.currentPage + this.siblingCount, this.totalPageCount());

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < this.totalPageCount() - 2;

    const firstPageIndex = 1;
    const lastPageIndex = this.totalPageCount();

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * this.siblingCount;
      const leftRange = this.range(1, leftItemCount);

      return [...leftRange, this.DOTS, this.totalPageCount()];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * this.siblingCount;
      const rightRange = this.range(this.totalPageCount() - rightItemCount + 1, this.totalPageCount());
      return [firstPageIndex, this.DOTS, ...rightRange];
    }

    const middleRange = this.range(leftSiblingIndex, rightSiblingIndex);
    return [firstPageIndex, this.DOTS, ...middleRange, this.DOTS, lastPageIndex];
  }

  isActive(val: number | string): boolean{
    if (typeof val === 'string')
      return false;

    return this.currentPage == val;
  }

  private range(start: number, end: number): number[] {
    let length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  setShowing():string {
    return 'Showing '+((this.currentPage-1) * this.pageSize + 1).toString()+'-'+Math.min((this.currentPage*this.pageSize),this.totalCount).toString()+' of '+ this.totalCount.toString();
  }
}
