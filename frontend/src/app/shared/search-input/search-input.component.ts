import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, fromEvent, debounceTime, map } from 'rxjs';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit, OnDestroy {

  @Input() shadow: boolean = false;
  @Input() color: string = 'white';
  @Input() control: FormControl | null = null;
  @Input() placeholder: string = "Search";
  @Input() liveSearch: boolean = false;
  @ViewChild('searchField') search!: ElementRef;
  @Output() onSubmit: EventEmitter<string> = new EventEmitter<string>();
  eventSubscription$?: Subscription;

  constructor() { }
  ngOnInit(): void { }

  submitString($event: any): void {
    const content = this.search?.nativeElement.value ?? "";
    this.onSubmit.emit(content);
  }

  ngAfterViewInit(): void {
    if (this.liveSearch)
      this.eventSubscription$ = fromEvent(this.search.nativeElement, 'input').pipe(
        debounceTime(1000),
        map(x => x as InputEvent),
        map(x => x.target as HTMLTextAreaElement),
        map(x => x.value))
        .subscribe(x => this.onSubmit.emit(x));
  }

  ngOnDestroy(): void {
    this.eventSubscription$?.unsubscribe();
  }
}
