import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { NewsService, News } from '../../../../core/services/news/news.service';
import type { NewsCoverItem } from '../../components/news-cover-carousel/news-cover-carousel.component';

type SortMode = 'recent' | 'popular';

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsFeedComponent implements OnInit, OnDestroy {
  loading = true;
  errorMsg = '';
  items: any = [
      { name: 'Angular', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg' },
      { name: 'TS', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
      { name: 'Node', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
      { name: 'Postgres', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
      { name: 'Docker', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
      { name: 'Git', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' }
  ]

  news: News[] = [];
  view: News[] = [];

  // right carousel items
  covers: NewsCoverItem[] = [];

  // pagination (backend)
  page = 1;
  pageSize = 8;
  totalPages = 1;

  // controls (frontend)
  searchCtrl = new FormControl<string>('', { nonNullable: true });
  sortCtrl = new FormControl<SortMode>('recent', { nonNullable: true });

  private sub = new Subscription();

  constructor(private api: NewsService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetch(1);

    this.sub.add(
      this.searchCtrl.valueChanges.pipe(debounceTime(150), distinctUntilChanged()).subscribe(() => {
        this.applyView();
        this.cdr.markForCheck();
      })
    );

    this.sub.add(
      this.sortCtrl.valueChanges.subscribe(() => {
        this.applyView();
        this.cdr.markForCheck();
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  fetch(page: number = this.page): void {
    this.loading = true;
    this.errorMsg = '';
    this.page = page;
    this.cdr.markForCheck();

    this.api.list(this.page, this.pageSize).subscribe({
      next: (res) => {
        this.news = res?.data ?? [];
        this.totalPages = res?.pagination?.totalPages ?? 1;

        this.applyView();

        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.news = [];
        this.view = [];
        this.covers = [];
        this.errorMsg = 'Não foi possível carregar as notícias agora.';
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  applyView(): void {
    const q = this.searchCtrl.value.trim().toLowerCase();
    const sort = this.sortCtrl.value;

    let data = [...this.news];

    // local search
    if (q) {
      data = data.filter((n) => {
        const t = (n.title ?? '').toLowerCase();
        const b = (n.body ?? '').toLowerCase();
        return t.includes(q) || b.includes(q);
      });
    }

    // sorting
    if (sort === 'popular') {
      data.sort((a, b) => (b.like ?? 0) - (a.like ?? 0) || (b.view ?? 0) - (a.view ?? 0));
    } else {
      data.sort((a, b) => {
        const ta = new Date(a.created_at ?? 0).getTime();
        const tb = new Date(b.created_at ?? 0).getTime();
        return tb - ta;
      });
    }

    this.view = data;

    // keep the right carousel in sync with view
    this.covers = this.view.map((n) => ({
      id: n.id,
      title: n.title,
      cover: n.cover_url ?? null, // adapt field name if needed
    }));
  }

  open(n: News): void {
    this.router.navigate(['/news', n.id]);
  }

  like(n: News, ev?: Event): void {
    if (ev) ev.stopPropagation();

    const prev = n.like ?? 0;
    n.like = prev + 1;
    this.cdr.markForCheck();

    this.api.like(n.id).subscribe({
      next: (updated) => {
        n.like = updated?.like ?? n.like;
        this.cdr.markForCheck();
      },
      error: () => {
        n.like = prev;
        this.cdr.markForCheck();
      },
    });
  }

  nextPage(): void {
    if (this.page < this.totalPages) this.fetch(this.page + 1);
  }

  prevPage(): void {
    if (this.page > 1) this.fetch(this.page - 1);
  }

  refresh(): void {
    this.fetch(this.page);
  }

  trackById(_i: number, n: News): string {
    return n.id;
  }

  hasResults(): boolean {
    return this.view.length > 0;
  }
}
