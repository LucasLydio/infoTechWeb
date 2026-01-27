import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
})
export class UserAvatarComponent {
  @Input() src?: string | null;
  @Input() name?: string | null;
  @Input() size: number = 40; // px

  get initials(): string {
    if (this.name) {
      const parts = this.name.trim().split(' ');
      return (parts[0]?.charAt(0) ?? '').toUpperCase() +
             (parts[1]?.charAt(0) ?? '');
    }
    return '?';
  }
}
