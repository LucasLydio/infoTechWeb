import { Component, Input } from '@angular/core';

type DevIcon = { name: string; src: string };

@Component({
  selector: 'app-devicon-ticker',
  templateUrl: './devicon-ticker.component.html',
  styleUrls: ['./devicon-ticker.component.scss'],
})
export class DeviconTickerComponent {
  @Input() items: DevIcon[] = [];
  @Input() duration = '22s';
}
