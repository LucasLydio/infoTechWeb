import { Component, HostListener, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/services/auth/auth.service';
import { AppTheme, ThemeService } from './core/services/theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnDestroy {
  isLoggedIn$: Observable<boolean>;
  menuOpen = false;

  hideTopbar = false;

  private sub = new Subscription();
  private lastScrollTop = 0;
  private readonly MOBILE_MAX = 680;
  private readonly DELTA = 10; // ignore tiny scroll jitter

  constructor(private auth: AuthService, private router: Router, private themeService: ThemeService) {
    this.isLoggedIn$ = this.auth.isLoggedIn$;

    // Close drawer when route changes
    this.sub.add(
      this.router.events
        .pipe(filter((e) => e instanceof NavigationEnd))
        .subscribe(() => {
          this.menuOpen = false;
          this.hideTopbar = false;
          this.lastScrollTop = window.scrollY || 0;
        })
    );
  }

  get theme(): AppTheme {
    return this.themeService.theme;
  }

  toggleTheme() {
    this.themeService.toggle();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;

    // while drawer open, keep header visible
    if (this.menuOpen) this.hideTopbar = false;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  // ESC closes
  @HostListener('document:keydown', ['$event'])
  onKeydown(event: Event): void {
    const e = event as KeyboardEvent;
    if (e.key === 'Escape') this.closeMenu();
  }

  // Click outside closes (button + drawer are considered "inside")
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.menuOpen) return;

    const el = event.target as HTMLElement;

    const clickedToggleBtn = el.closest('[aria-controls="mobile-drawer"]');
    const clickedDrawer = el.closest('#mobile-drawer');

    if (clickedToggleBtn || clickedDrawer) return;

    this.closeMenu();
  }

  // Hide on scroll down, show on scroll up (only <= 680px)
  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (window.innerWidth > this.MOBILE_MAX) {
      this.hideTopbar = false;
      this.lastScrollTop = window.scrollY || 0;
      return;
    }

    // if drawer is open, don't hide
    if (this.menuOpen) return;

    const st = window.scrollY || 0;
    const diff = st - this.lastScrollTop;

    if (Math.abs(diff) < this.DELTA) return;

    if (diff > 0) {
      // scrolling down
      this.hideTopbar = true;
    } else {
      // scrolling up
      this.hideTopbar = false;
    }

    this.lastScrollTop = st;
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > this.MOBILE_MAX) this.hideTopbar = false;
  }
}
