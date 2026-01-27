import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { News } from '../../../../core/services/news/news.service';

@Component({
  selector: 'app-news-item',
  templateUrl: './news-item.component.html',
  styleUrls: ['./news-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsItemComponent {
  @Input({ required: true }) news!: News;

  @Output() open = new EventEmitter<void>();
  @Output() like = new EventEmitter<Event>();

  preview(): string {
    const body = (this.news?.body ?? '').toString();
    return body.length > 160 ? body.slice(0, 160) + '…' : body;
  }
}
