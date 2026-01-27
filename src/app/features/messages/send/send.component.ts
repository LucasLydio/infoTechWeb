import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../../core/services/users/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PrivateMessagesService } from '../../../core/services/messages/messages.service';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss']
})
export class SendComponent implements OnInit {
  sendForm: FormGroup;
  submitting = false;
  errorMsg = '';
  users: any[] = [];
  toUserId: string | null = null;

  currentPage = 1;
  pageSize = 10;
  hasMore = true;
  loadingUsers = false;

  constructor(
    private fb: FormBuilder,
    private pmService: PrivateMessagesService,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.sendForm = this.fb.group({
      to_user_id: ['', Validators.required],
      body: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.toUserId = this.route.snapshot.paramMap.get('to');
    this.loadUsers(); // Página 1
  }

  loadUsers(): void {
    if (this.loadingUsers || !this.hasMore) return;

    this.loadingUsers = true;
    this.usersService.listAll(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        if (Array.isArray(res.data)) {
          this.users.push(...res.data);
          this.hasMore = res.data.length === this.pageSize;
          this.currentPage++;
          if (this.toUserId) {
            this.sendForm.patchValue({ to_user_id: this.toUserId });
          }
        } else {
          this.hasMore = false;
        }
        this.loadingUsers = false;
      },
      error: () => {
        this.hasMore = false;
        this.loadingUsers = false;
      }
    });
  }

  send() {
    if (this.sendForm.invalid) return;
    this.submitting = true;
    this.errorMsg = '';
    this.pmService.send(this.sendForm.value).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/messages']);
      },
      error: () => {
        this.errorMsg = 'Erro ao enviar mensagem.';
        this.submitting = false;
      }
    });
  }
}
