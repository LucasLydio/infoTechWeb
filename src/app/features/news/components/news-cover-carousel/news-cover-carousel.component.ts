import { Component, Input, OnDestroy, OnInit } from '@angular/core';

export type NewsCoverItem = {
  id: string;
  title: string;
  cover?: string | null;
};

@Component({
  selector: 'app-news-cover-carousel',
  templateUrl: './news-cover-carousel.component.html',
  styleUrls: ['./news-cover-carousel.component.scss'],
})
export class NewsCoverCarouselComponent implements OnInit, OnDestroy {
  @Input() items: NewsCoverItem[] = [];
  @Input() intervalMs = 7000;

  active = 0;
  private t: any;

  ngOnInit(): void {
    if (!this.items.length) return;
    this.t = setInterval(() => {
      this.active = (this.active + 1) % this.items.length;
    }, this.intervalMs);
  }

  ngOnDestroy(): void {
    if (this.t) clearInterval(this.t);
  }

  setActive(i: number) {
    this.active = i;
  }

  get bg(): string {
    const it = this.items[this.active];
    return it?.cover || '/assets/img/foxForum.webp';
  }

  get title(): string {
    return this.items[this.active]?.title || '';
  }

  get id(): string {
    return this.items[this.active]?.id || '';
  }
}
