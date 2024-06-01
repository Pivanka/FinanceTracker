import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { selectMembers } from '../resources/state/general.selector';
import { Observable, map } from 'rxjs';
import { AppState } from '../../../store';
import { openAddMemberModal } from '../../../store/actions/modal.actions';
import { isSpinnerShowing } from '../../../store/selectors/spinner.selectors';
import { SignalRService } from '../../../core/resources/services/signalR.service';
import { SignalRType } from '../../../shared/models/signalR-type';
import { loadMembers } from '../resources/state/general.actions';
import { Role } from '../../auth/resources/models/role';
import { selectRole } from '../../settings/resources/state/settings.selector';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  hasAccess$!: Observable<boolean | null>;
  members$ = this.store.select(selectMembers);
  loading!: Observable<boolean>;

  constructor(private store: Store<AppState>, private signalRService: SignalRService) {
    this.hasAccess$ = this.store.pipe(select(selectRole)).pipe(
      map(role => role == Role.Admin)
    );
  }

  ngOnInit() {
    this.loading = this.store.pipe(select(isSpinnerShowing));
    this.signalRService.addChangesListener((type: SignalRType) => {
      if(type === SignalRType.Member) {
        this.store.dispatch(loadMembers());
      }
    });
  }

  openAddEmployeeModal() {
    this.store.dispatch(openAddMemberModal());
  }
}
