import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm: FormGroup;
  submitting = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {

    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const pass = form.get('password')?.value;
    const confirm = form.get('confirm')?.value;

    return pass === confirm ? null : { mismatch: true };
  }

  submit() {
    if (this.registerForm.invalid) return;

    this.submitting = true;
    this.errorMsg = '';

    const { name, email, password } = this.registerForm.value;

    const payload = { name, email, password };

    this.auth.register(payload).subscribe({
      next: user => {
        this.submitting = false;
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.errorMsg = 'Falha ao cadastrar. Verifique os dados e tente novamente.';
        this.submitting = false;
      }
    });
  }
}
