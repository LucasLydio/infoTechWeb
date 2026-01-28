import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth/auth.service';

type DevIconItem = { name: string; src: string };
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoggedIn$: Observable<boolean>;

  // --- carousel mock ---
  carouselItems: DevIconItem[] = [
    { name: 'Angular', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg' },
    { name: 'TypeScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'JavaScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'Node.js', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { name: 'Express', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
    { name: 'Prisma', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg' },
    { name: 'PostgreSQL', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
    { name: 'Redis', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg' },
    { name: 'Docker', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
    { name: 'Git', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { name: 'HTML5', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    { name: 'CSS3', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
    { name: 'Sass', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg' },
    { name: 'Bootstrap', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg' },
    { name: 'NGXS / NgRx', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg' },
  ];

  carouselDuration = '32s'; // slower/faster: e.g. 24s, 40s

  private raf = 0;
  private targetX = 0.5;
  private targetY = 0.5;

  constructor(private host: ElementRef<HTMLElement>, private auth: AuthService) {
    this.isLoggedIn$ = this.auth.isLoggedIn$;
  }

  ngOnInit(): void {
    this.applyParallaxVars(0.5, 0.5);

    // Optional: duration based on item count
    this.carouselDuration = `${Math.max(22, this.carouselItems.length * 2)}s`;
  }

  ngOnDestroy(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
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
