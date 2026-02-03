import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Topic } from '../../../../shared/models/topic.model';
import { TopicsService } from '../../../../core/services/topics/topics.service';

type SortKey = 'recent' | 'oldest' | 'title';

@Component({
  selector: 'app-topics-list',
  templateUrl: './topics-list.component.html',
  styleUrls: ['./topics-list.component.scss'],
})
export class TopicsListComponent implements OnInit {
  topics: Topic[] = [];
  filteredTopics: Topic[] = [];
  loading = true;
  loadingMore = false;
  filtersOpen = false;


  currentPage = 1;
  totalPages = 1;
  pageSize = 10;


  query = '';
  sort: SortKey = 'recent';

  constructor(private topicsService: TopicsService, private router: Router) {}

  ngOnInit(): void {
    this.fetchTopics(1);
  }


  fetchTopics(page: number = 1): void {
    this.loading = true;

    this.topicsService.list(page, this.pageSize).subscribe({
      next: (res) => {
        this.topics = res.data ?? [];
        this.currentPage = res.pagination.page;
        this.totalPages = res.pagination.totalPages;

        this.applyAll();
        this.loading = false;
      },
      error: () => {
        this.topics = [];
        this.filteredTopics = [];
        this.loading = false;
      },
    });
  }


  loadMore(): void {
    if (this.loadingMore) return;
    if (this.currentPage >= this.totalPages) return;

    this.loadingMore = true;

    const nextPage = this.currentPage + 1;

    this.topicsService.list(nextPage, this.pageSize).subscribe({
      next: (res) => {
        const newItems = res.data ?? [];


        const seen = new Set(this.topics.map((t) => t.id));
        for (const t of newItems) {
          if (!seen.has(t.id)) this.topics.push(t);
        }

        this.currentPage = res.pagination.page;
        this.totalPages = res.pagination.totalPages;

        this.applyAll();
        this.loadingMore = false;
      },
      error: () => {
        this.loadingMore = false;
      },
    });
  }

  openTopic(topic: Topic) {
    this.router.navigate(['/topics', topic.id]);
  }


  changePageSize(): void {
    this.fetchTopics(1);
  }


  onSearch(): void {
    this.applyAll();
  }

  clearSearch(): void {
    this.query = '';
    this.applyAll();
  }

  applySort(): void {
    this.applyAll();
  }

  private applyAll(): void {
    const q = this.query.trim().toLowerCase();

    let list = [...this.topics];


    if (q) {
      list = list.filter((t) => {
        const title = (t.title ?? '').toLowerCase();
        const body = (t.body ?? '').toLowerCase();
        const author = (t.user?.name ?? '').toLowerCase();
        return title.includes(q) || body.includes(q) || author.includes(q);
      });
    }


    if (this.sort === 'title') {
      list.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''));
    } else if (this.sort === 'oldest') {
      list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    this.filteredTopics = list;
  }

  trackById(_i: number, t: Topic) {
    return t.id;
  }
}
