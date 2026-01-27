import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UsersService } from '../../../core/services/users/users.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-picker',
  templateUrl: './user-picker.component.html',
  styleUrls: ['./user-picker.component.scss'],
})
export class UserPickerComponent implements OnInit, OnDestroy {
  /** Bind your form control: [control]="form.get('to_user_id') as FormControl" */
  @Input({ required: true }) control!: FormControl<string | null>;

  /** Optional: exclude a user id (e.g. current user) */
  @Input() excludeUserId: string | null = null;

  /** Optional label */
  @Input() label = 'Para';

  /** Emits selected user object (optional) */
  @Output() selected = new EventEmitter<User>();

  loading = true;
  errorMsg = '';

  // data
  users: User[] = [];
  filtered: User[] = [];

  // pagination (light)
  page = 1;
  pageSize = 20;
  totalPages = 1;

  // UI
  open = false;
  q = '';

  private sub = new Subscription();

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.fetch();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  fetch(page: number = 1): void {
    this.loading = true;
    this.errorMsg = '';
    this.page = page;

    this.sub.add(
      this.usersService.listAll(this.page, this.pageSize).subscribe({
        next: (res) => {
          const data: User[] = res?.data ?? [];
          const pagination = res?.pagination ?? res?.meta ?? null;

          // tolerate different backend shapes:
          this.totalPages = pagination?.totalPages ?? 1;

          this.users =
            this.excludeUserId
              ? data.filter((u) => u.id !== this.excludeUserId)
              : data;

          this.applyFilter();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.errorMsg = 'Não foi possível carregar usuários.';
        },
      })
    );
  }

  toggle(): void {
    this.open = !this.open;
  }

  close(): void {
    this.open = false;
  }

  applyFilter(): void {
    const q = this.q.trim().toLowerCase();
    if (!q) {
      this.filtered = [...this.users];
      return;
    }

    this.filtered = this.users.filter((u) => {
      const name = (u.name ?? '').toLowerCase();
      const email = (u.email ?? '').toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }

  clearSearch(): void {
    this.q = '';
    this.applyFilter();
  }

  pick(u: User): void {
    this.control.setValue(u.id);
    this.control.markAsDirty();
    this.control.markAsTouched();
    this.selected.emit(u);
    this.close();
  }

  // helpers for template
  currentLabel(): string {
    const id = this.control.value;
    if (!id) return 'Selecione um usuário…';
    const found = this.users.find((u) => u.id === id);
    return found ? found.name : 'Usuário selecionado';
  }

  currentAvatar(): string | null {
    const id = this.control.value;
    if (!id) return null;
    const found = this.users.find((u) => u.id === id);
    return found?.avatar_url ?? null;
  }

  nextPage(): void {
    if (this.page < this.totalPages) this.fetch(this.page + 1);
  }

  prevPage(): void {
    if (this.page > 1) this.fetch(this.page - 1);
  }

  trackUser(_i: number, u: User): string {
    return u.id;
  }
}
