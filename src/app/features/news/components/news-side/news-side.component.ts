import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { News, NewsService } from '../../../../core/services/news/news.service';

@Component({
  selector: 'app-news-side',
  templateUrl: './news-side.component.html',
  styleUrls: ['./news-side.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsSideComponent implements OnInit {
  loading = true;
  errorMsg = '';

  items: News[] = [];

  // tweak as you like
  pageSize = 8;

  constructor(private api: NewsService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.loading = true;
    this.errorMsg = '';

    this.api.list(1, this.pageSize).subscribe({
      next: (res) => {
        this.items = res?.data ?? [];
        this.loading = false;
          this.cdr.markForCheck();
      },
      error: () => {
        this.items = [];
        this.errorMsg = 'Falha ao carregar notícias.';
        this.loading = false;
      },
    });
  }

  openNews(id: string): void {
    this.router.navigate(['/news', id]);
  }

  goToFeed(): void {
    this.router.navigate(['/news']);
  }

  goToCreate(): void {
    this.router.navigate(['/news/new']);
  }

  // ---- view helpers (avoid heavy template logic) ----
  hasItems(): boolean {
    return this.items.length > 0;
  }

  top(): News[] {
    const data = [...this.items];
    data.sort((a, b) => (b.like ?? 0) - (a.like ?? 0) || (b.view ?? 0) - (a.view ?? 0));
    return data.slice(0, 3);
  }

  recent(): News[] {
    const data = [...this.items];
    data.sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''));
    return data.slice(0, 5);
  }

  preview(n: News): string {
    const body = (n?.body ?? '').toString();
    return body.length > 72 ? body.slice(0, 72) + '…' : body;
  }

  trackById(_i: number, n: News): string {
    return n.id;
  }
}
