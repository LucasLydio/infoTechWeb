import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { NewsService, News, NewsReply } from '../../../../core/services/news/news.service';
import { ReplyNewsService } from '../../../../core/services/replyNews/reply-news.service';

@Component({
  selector: 'app-news-details-page',
  templateUrl: './news-details.component.html',
  styleUrls: ['./news-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsDetailsComponent implements OnInit, OnDestroy {
  loading = true;
  errorMsg = '';

  newsId = '';
  news: News | null = null;

  replies: NewsReply[] = [];
  repliesPage = 1;
  repliesPageSize = 8;
  repliesTotalPages = 1;

  liking = false;

  replying = false;
  replyError = '';
  replyOk = '';

  form: any;

  private sub = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: NewsService,
    private replyApi: ReplyNewsService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
    body: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(1200)]],
  });
  }

  ngOnInit(): void {
    this.sub.add(
      this.route.paramMap.subscribe((pm) => {
        this.newsId = (pm.get('id') ?? '').toString();
        this.repliesPage = 1;
        this.fetch();
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get bodyCtrl() { return this.form.get('body'); }

  fetch(): void {
    if (!this.newsId) return;

    this.loading = true;
    this.errorMsg = '';

    this.api.getById(this.newsId, this.repliesPage, this.repliesPageSize).subscribe({
      next: (res) => {
        this.news = res?.news ?? null;
        this.replies = res?.replies ?? [];
        this.repliesTotalPages = res?.repliesPagination?.totalPages ?? 1;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.news = null;
        this.replies = [];
        this.errorMsg = 'Não foi possível carregar esta notícia.';
        this.loading = false;
      },
    });
  }

  back(): void {
    this.router.navigate(['/news']);
  }

  like(): void {
    if (!this.news || this.liking) return;

    this.liking = true;

    const prev = this.news.like ?? 0;
    this.news.like = prev + 1;

    this.api.like(this.news.id).subscribe({
      next: (updated) => {
        if (this.news) this.news.like = updated?.like ?? this.news.like;
        this.liking = false;
      },
      error: () => {
        if (this.news) this.news.like = prev;
        this.liking = false;
      },
    });
  }

  submitReply(): void {
    this.replyError = '';
    this.replyOk = '';

    if (!this.newsId) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const body = (this.bodyCtrl?.value ?? '').toString().trim();
    if (!body) return;

    this.replying = true;

    this.replyApi.create(this.newsId, { body }).subscribe({
      next: () => {
        this.replying = false;
        this.replyOk = 'Comentário publicado!';
        this.form.reset({ body: '' });

        // refresh replies (stay on page 1 to show newest)
        this.repliesPage = 1;
        this.fetch();

        setTimeout(() => (this.replyOk = ''), 1200);
      },
      error: () => {
        this.replying = false;
        this.replyError = 'Não foi possível comentar agora.';
      },
    });
  }

  nextReplies(): void {
    if (this.repliesPage < this.repliesTotalPages) {
      this.repliesPage++;
      this.fetch();
    }
  }

  prevReplies(): void {
    if (this.repliesPage > 1) {
      this.repliesPage--;
      this.fetch();
    }
  }

  replyPreview(r: NewsReply): string {
    const b = (r?.body ?? '').toString();
    return b;
  }

  trackReply(_i: number, r: NewsReply): string {
    return r.id;
  }
}
