import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { Users } from './Users.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-users-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './users-settings.component.html',
  styleUrls: ['./users-settings.component.scss'],
})
export class UsersSettingsComponent implements OnInit, OnDestroy {
  users: Users[] = [];
  passwords: { [userId: number]: string } = {};
  private destroy$ = new Subject<void>();

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api
      .selectAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res) this.users = res;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  deleteUser(id: number) {
    this.api
      .deleteUser(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res) {
          this.users = this.users.filter((user) => user.id !== id);
        }
      });
  }

  updatePassword(user: Users) {
    const newPwd = this.passwords[user.id];
    this.api
      .updatePasswordUser(user.id, newPwd)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res) {
          this.passwords[user.id] = '';
        } else {
        }
      });
  }

  updateRoleUser(user: Users) {
    this.api
      .updateRoleUser(user.id, user.role)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res) {
        } else {
        }
      });
  }
}
