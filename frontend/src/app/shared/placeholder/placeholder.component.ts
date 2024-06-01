import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, interval, take } from 'rxjs';

@Component({
  selector: 'app-placeholder',
  templateUrl: './placeholder.component.html',
  styleUrls: ['./placeholder.component.scss']
})
export class PlaceholderComponent implements OnInit, OnDestroy {

  @Input() skipLargeLine = false;
  @Input() lines = 4;
  @Input() baseInterval = 500;
  @Input() flexOption: "row" | "col" = "col";

  smallLines: boolean[] = [];
  sub?: Subscription;

  constructor() { }

  ngOnInit(): void {
    for(let i = 0; i < this.lines; i++){
      this.smallLines.push(false);
    }

    this.sub = this.takeLines$().subscribe(x => {
      this.smallLines[x] = true;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  takeLines$(): Observable<number> {
    const numbers = interval(this.baseInterval * (Math.random() * (3 - 2) + 2));
    return numbers.pipe(take(this.lines));
  }
}
