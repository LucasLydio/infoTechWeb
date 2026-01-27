import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoggedIn$: Observable<boolean>;

  private raf = 0;
  private targetX = 0.5; // 0..1
  private targetY = 0.5; // 0..1

  constructor(private host: ElementRef<HTMLElement>, private auth: AuthService) {
    this.isLoggedIn$ = this.auth.isLoggedIn$;
  }

  ngOnInit(): void {
    // initial center
    this.applyParallaxVars(0.5, 0.5);
  }

  ngOnDestroy(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    // Normalize pointer position across viewport (0..1)
    const nx = Math.min(1, Math.max(0, e.clientX / window.innerWidth));
    const ny = Math.min(1, Math.max(0, e.clientY / window.innerHeight));
    this.targetX = nx;
    this.targetY = ny;

    if (this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.applyParallaxVars(this.targetX, this.targetY);
      this.raf = 0;
    });
  }

  private applyParallaxVars(nx: number, ny: number) {
    const el = this.host.nativeElement;
    el.style.setProperty('--mx', String(nx));
    el.style.setProperty('--my', String(ny));
  }
}
