import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NewsService } from '../../../../core/services/news/news.service';

@Component({
  selector: 'app-news-create-page',
  templateUrl: './news-create.component.html',
  styleUrls: ['./news-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsCreateComponent {
  loading = false;
  errorMsg = '';
  okMsg = '';

  form: any;

  constructor(private fb: FormBuilder, private api: NewsService, private router: Router) {
    this.form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(90)]],
    body: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(4000)]],
  });
  }

  get titleCtrl() { return this.form.get('title'); }
  get bodyCtrl() { return this.form.get('body'); }

  titleLen(): number {
    return (this.titleCtrl?.value ?? '').toString().length;
  }

  bodyLen(): number {
    return (this.bodyCtrl?.value ?? '').toString().length;
  }

  previewTitle(): string {
    const t = (this.titleCtrl?.value ?? 'Título da notícia').toString().trim();
    return t || 'Título da notícia';
  }

  previewBody(): string {
    const b = (this.bodyCtrl?.value ?? 'Escreva uma descrição clara do que está acontecendo.').toString();
    return b.length > 300 ? b.slice(0, 300) + '…' : b;
  }

  submit(): void {
    this.errorMsg = '';
    this.okMsg = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const title = (this.titleCtrl?.value ?? '').toString().trim();
    const body = (this.bodyCtrl?.value ?? '').toString().trim();

    this.loading = true;

    this.api.create({ title, body }).subscribe({
      next: (created) => {
        this.loading = false;
        this.okMsg = 'Notícia publicada! Redirecionando…';
        setTimeout(() => this.router.navigate(['/news', created.id]), 650);
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'Não foi possível publicar agora.';
      },
    });
  }
}
