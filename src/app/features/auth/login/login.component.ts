import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  submitting = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submit() {
    if (this.loginForm.invalid) return;
    this.submitting = true;
    this.errorMsg = '';
    const { email, password } = this.loginForm.value;

    this.auth.login(email, password).subscribe({
      next: user => {
        this.submitting = false;
        this.router.navigate(['/']);
      },
      error: err => {
        this.errorMsg = 'Usuário ou senha inválidos.';
        this.submitting = false;
      }
    });
  }
}
