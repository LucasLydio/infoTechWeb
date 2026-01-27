import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

type SortMode = 'recent' | 'popular';

@Component({
  selector: 'app-news-toolbar',
  templateUrl: './news-toolbar.component.html',
  styleUrls: ['./news-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsToolbarComponent {
  @Input({ required: true }) searchCtrl!: FormControl<string>;
  @Input({ required: true }) sortCtrl!: FormControl<SortMode>;

  @Output() refresh = new EventEmitter<void>();

  clear(): void {
    this.searchCtrl.setValue('');
  }
}
