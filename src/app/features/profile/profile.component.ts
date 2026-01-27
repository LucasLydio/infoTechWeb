import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { UsersService } from '../../core/services/users/users.service';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../../core/services/auth/auth.service';

type ViewState = 'loading' | 'ready' | 'error';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy {
  state: ViewState = 'loading';
  errorMsg = '';

  user: User | null = null;
  private originalSnapshot: Pick<User, 'name' | 'avatar_url'> | null = null;

  form!: FormGroup;
  isSaving = false;
  isDirty = false;

  copied = false;

  private sub = new Subscription();

  constructor(private users: UsersService, private fb: FormBuilder, private auth: AuthService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      avatar_url: [''],
    });

    // track "dirty" based on snapshot (not Angular's dirty alone)
    this.sub.add(
      this.form.valueChanges.subscribe(() => {
        if (!this.originalSnapshot) return;
        const v = this.form.getRawValue();
        this.isDirty =
          (v.name ?? '') !== (this.originalSnapshot.name ?? '') ||
          (v.avatar_url ?? '') !== (this.originalSnapshot.avatar_url ?? '');
      })
    );

    this.loadMe();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  loadMe(): void {
    this.state = 'loading';
    this.errorMsg = '';
    this.copied = false;

    this.sub.add(
      this.auth.getMe().subscribe({
        next: (u) => {
          this.user = u;
          this.originalSnapshot = {
            name: u.name,
            avatar_url: u.avatar_url ?? '',
          };

          this.form.patchValue({
            name: u.name ?? '',
            avatar_url: u.avatar_url ?? '',
          });

          this.isDirty = false;
          this.state = 'ready';
        },
        error: () => {
          this.errorMsg = 'Não foi possível carregar seu perfil agora.';
          this.state = 'error';
        },
      })
    );
  }

  reset(): void {
    if (!this.originalSnapshot) return;
    this.form.patchValue({
      name: this.originalSnapshot.name ?? '',
      avatar_url: this.originalSnapshot.avatar_url ?? '',
    });
    this.isDirty = false;
  }

  async copyEmail(): Promise<void> {
    const email = this.user?.email ?? '';
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email);
      this.copied = true;
      setTimeout(() => (this.copied = false), 1200);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      this.copied = true;
      setTimeout(() => (this.copied = false), 1200);
    }
  }

  save(): void {
    if (!this.user) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    const payload: Partial<User> = {
      name: this.form.get('name')?.value,
      avatar_url: this.form.get('avatar_url')?.value || undefined,
    };

    this.sub.add(
      this.users.update(this.user.id, payload).subscribe({
        next: (updated) => {
          this.user = updated;

          this.originalSnapshot = {
            name: updated.name,
            avatar_url: updated.avatar_url ?? '',
          };

          this.form.patchValue({
            name: updated.name ?? '',
            avatar_url: updated.avatar_url ?? '',
          });

          this.isDirty = false;
          this.isSaving = false;
        },
        error: () => {
          this.errorMsg = 'Falha ao salvar. Verifique sua conexão e tente novamente.';
          this.isSaving = false;
        },
      })
    );
  }

  get nameCtrl() {
    return this.form.get('name');
  }

  get avatarCtrl() {
    return this.form.get('avatar_url');
  }

  get createdAtDate(): Date | null {
    if (!this.user?.created_at) return null;
    const d = new Date(this.user.created_at);
    return isNaN(d.getTime()) ? null : d;
  }

  get avatarPreview(): string | undefined {
    const v = (this.avatarCtrl?.value ?? '').trim();
    return v.length ? v : this.user?.avatar_url;
  }
}
