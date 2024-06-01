import { Component, Input, OnInit } from '@angular/core';
import { Member } from '../../resources/models/member';
import { Store, select } from '@ngrx/store';
import * as fromGeneralActions from '../../resources/state/general.actions';
import { AppState } from '../../../../store';
import { Role } from '../../../auth/resources/models/role';
import { Observable, map } from 'rxjs';
import { selectRole } from '../../../settings/resources/state/settings.selector';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {
  @Input() member!: Member;
  isDropdownOpen = false;
  hasAccess$!: Observable<boolean | null>;

  Role = Role;
  roles = getValueEnum(Role);

  constructor(private store: Store<AppState>) {
    this.hasAccess$ = this.store.pipe(select(selectRole)).pipe(
      map(role => role == Role.Admin)
    );
  }

  ngOnInit(): void {}

  ResendEmail() {
    this.store.dispatch(
      fromGeneralActions.resendMemberEmail({ id: this.member.id })
    );
  }

  selectImage(avatar:string|undefined) {
    let st = avatar ?? "assets/images/icons/avatar.svg";
    return `url('${st}')`;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  ChangeRole(role: any) {
    this.store.dispatch(
      fromGeneralActions.updateMemberRole({ id: this.member.id, role: role })
    );
  }
}

export function getValueEnum(enumObj: any){
  return Object.values(enumObj).filter(x => !isNaN(Number(x)) && x !== 3);
}
