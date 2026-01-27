import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { PrivateMessagesService } from '../../../core/services/messages/messages.service';

type Mailbox = 'inbox' | 'sent';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})
export class InboxComponent implements OnInit {
  mailbox: Mailbox = 'inbox';

  loading = true;
  errorMsg = '';

  // We keep these as any to match backend shape (from_user/to_user/read)
  items: any[] = [];
  filtered: any[] = [];
  selected: any | null = null;

  // pagination
  page = 1;
  pageSize = 12;
  totalPages = 1;

  // search
  query = '';

  // composer
  isComposing = false;
  sending = false;
  sendError = '';
  sendOk = false;

  form: any;

  constructor(private api: PrivateMessagesService, private fb: FormBuilder) {
      this.form = this.fb.group({
      to_user_id: ['', [Validators.required]],
      body: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(1200)]],
    });
  }

  ngOnInit(): void {
    this.fetch();
  }

  setMailbox(box: Mailbox): void {
    if (this.mailbox === box) return;

    this.mailbox = box;
    this.page = 1;
    this.query = '';
    this.selected = null;
    this.fetch();
  }

  fetch(): void {
    this.loading = true;
    this.errorMsg = '';

    const req =
      this.mailbox === 'inbox'
        ? this.api.listInbox(this.page, this.pageSize)
        : this.api.listSent(this.page, this.pageSize);

    req.subscribe({
      next: (res) => {
        this.items = res?.data ?? [];
        this.totalPages = res?.pagination?.totalPages ?? 1;

        this.applyFilter();

        // Facebook-like: auto-select first item
        this.selected = this.filtered.length ? this.filtered[0] : null;

        // Mark selected as read (inbox only)
        if (this.mailbox === 'inbox' && this.selected) {
          this.ensureRead(this.selected);
        }

        this.loading = false;
      },
      error: () => {
        this.items = [];
        this.filtered = [];
        this.selected = null;
        this.errorMsg = 'Não foi possível carregar suas mensagens.';
        this.loading = false;
      },
    });
  }

  // ---------- Filtering ----------
  applyFilter(): void {
    const q = this.query.trim().toLowerCase();

    if (!q) {
      this.filtered = [...this.items];
      return;
    }

    this.filtered = this.items.filter((m) => {
      const name = this.rowName(m).toLowerCase();
      const body = (m?.body ?? '').toString().toLowerCase();
      return name.includes(q) || body.includes(q);
    });
  }

  clearSearch(): void {
    this.query = '';
    this.applyFilter();
  }

  // ---------- Selection ----------
  select(m: any): void {
    this.selected = m;
    if (this.mailbox === 'inbox') this.ensureRead(m);
  }

  get toUserCtrl(): FormControl {
    return this.form.get('to_user_id') as FormControl;
  }

  private ensureRead(m: any): void {
    // if backend sends "read" boolean
    if (m?.read === true) return;
    if (!m?.id) return;

    this.api.markAsRead(m.id).subscribe({
      next: (updated) => {
        // Update local arrays
        const idx = this.items.findIndex((x) => x?.id === updated?.id);
        if (idx >= 0) this.items[idx] = { ...this.items[idx], ...updated };

        if (this.selected?.id === updated?.id) {
          this.selected = { ...this.selected, ...updated };
        }

        this.applyFilter();
      },
      error: () => {},
    });
  }

  // ---------- Pagination ----------
  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.fetch();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.fetch();
    }
  }

  // ---------- Compose ----------
  openCompose(): void {
    this.sendError = '';
    this.sendOk = false;
    this.isComposing = true;
  }

  closeCompose(): void {
    this.isComposing = false;
  }

  send(): void {
    this.sendError = '';
    this.sendOk = false;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const to_user_id = (this.form.value.to_user_id ?? '').toString().trim();
    const body = (this.form.value.body ?? '').toString().trim();

    if (!to_user_id || !body) return;

    this.sending = true;

    this.api.send({ to_user_id, body }).subscribe({
      next: () => {
        this.sending = false;
        this.sendOk = true;

        // UX: switch to sent & refresh
        setTimeout(() => {
          this.isComposing = false;
          this.form.reset({ to_user_id: '', body: '' });
          this.setMailbox('sent');
        }, 650);
      },
      error: (err) => {
        this.sending = false;
        this.sendError = err?.status === 401 ? 'Você precisa estar logado.' : 'Falha ao enviar mensagem.';
      },
    });
  }

  // ---------- Template helpers (NO "as any" in HTML) ----------
  private otherUser(m: any): any {
    return this.mailbox === 'inbox' ? m?.from_user : m?.to_user;
  }

  rowId(m: any): string {
    return (m?.id ?? '').toString();
  }

  rowName(m: any): string {
    return (this.otherUser(m)?.name ?? 'Usuário').toString();
  }

  rowAvatar(m: any): string | null {
    const v = this.otherUser(m)?.avatar_url ?? null;
    return v ? v.toString() : null;
  }

  rowCreatedAt(m: any): string {
    return (m?.created_at ?? '').toString();
  }

  rowSnippet(m: any): string {
    const body = (m?.body ?? '').toString();
    return body.length > 75 ? body.slice(0, 75) + '…' : body;
  }

  isUnread(m: any): boolean {
    return this.mailbox === 'inbox' && m?.read === false;
  }

  isActiveRow(m: any): boolean {
    return !!this.selected && this.rowId(this.selected) === this.rowId(m);
  }

  selectedUserName(): string {
    return this.rowName(this.selected);
  }

  selectedUserAvatar(): string | null {
    return this.rowAvatar(this.selected);
  }

  selectedBody(): string {
    return (this.selected?.body ?? '').toString();
  }

  selectedCreatedAt(): string {
    return this.rowCreatedAt(this.selected);
  }

  // trackBy
  trackById = (_i: number, m: any) => this.rowId(m);
}
