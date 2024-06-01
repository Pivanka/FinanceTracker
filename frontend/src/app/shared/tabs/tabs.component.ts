import { AfterContentInit, Component, ContentChildren, Directive, EventEmitter, Input, Output, QueryList, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

@Directive({ selector: 'app-tab' })
export class Tab {
  active: boolean = false;
  @Input() title!: string;
  @Input() count!: number | null;
  @Input() link!: string;
  @Input() template!: TemplateRef<any>;
}

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(Tab) tabs!: QueryList<Tab>;
  @Input() showSearch: boolean = false;
  @Input() onSearch?: (query: string) => void;
  @Input() height = "70vh";
  @Output() templateEvent: EventEmitter<TemplateRef<any>> = new EventEmitter<TemplateRef<any>>();
  @Output() activeTabChange:EventEmitter<string> = new EventEmitter<string>();

  constructor(private router: Router) { }

  private initialized = false;
  ngAfterContentInit(): void {
    if (this.initialized === false) {
      const currentRoute = this.router.url.split('/').slice(-1)[0];
      this.setActiveTab(currentRoute);

      this.initialized = true;
    }
  }

  setActiveTab(currentRoute: string) {
    for (let i = 0; i < this.tabs.length; i++) {
      const updatedTabs = this.tabs.map(t => {
        if (t.link == currentRoute) {
          t.active = true;
          console.log(t.title)
          this.activeTabChange.emit(t.title);
        }
        else t.active = false
        return t;
      });
      this.tabs.reset(updatedTabs);
    }
  }

  selectTab(tab: Tab) {
    // deactivate all tabs
    this.tabs.toArray().forEach(tab => tab.active = false);
    // activate the tab the user has clicked on.
    tab.active = true;
    this.templateEvent.emit(tab.template);
    this.activeTabChange.emit(tab.title);
  }

}
