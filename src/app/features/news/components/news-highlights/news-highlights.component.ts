import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { News } from '../../../../core/services/news/news.service';
import { Router } from '@angular/router';
import { SharedModule } from "../../../../shared/shared.module";

@Component({
  selector: 'app-news-highlights',
  templateUrl: './news-highlights.component.html',
  styleUrls: ['./news-highlights.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsHighlightsComponent {
  @Input() items: News[] = [];

  constructor(private router: Router) {}

  top(): News[] {
    const data = [...(this.items ?? [])];
    data.sort((a, b) => (b.like ?? 0) - (a.like ?? 0) || (b.view ?? 0) - (a.view ?? 0));
    return data.slice(0, 3);
  }

  open(n: News): void {
    this.router.navigate(['/news', n.id]);
  }
}
