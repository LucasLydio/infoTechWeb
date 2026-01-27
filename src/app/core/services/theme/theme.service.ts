// src/app/core/services/theme.service.ts
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export type AppTheme = "light" | "dark";

const STORAGE_KEY = "itgo.theme";

@Injectable({ providedIn: "root" })
export class ThemeService {
  private readonly _theme$ = new BehaviorSubject<AppTheme>(this.getInitialTheme());

  /** Reactive theme state */
  readonly theme$ = this._theme$.asObservable();

  /** Sync getter (useful for templates) */
  get theme(): AppTheme {
    return this._theme$.value;
  }

  constructor() {
    // apply ASAP on service creation
    this.applyTheme(this._theme$.value);
  }

  toggle(): void {
    const next: AppTheme = this.theme === "dark" ? "light" : "dark";
    this.setTheme(next);
  }

  setTheme(theme: AppTheme): void {
    this._theme$.next(theme);
    localStorage.setItem(STORAGE_KEY, theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: AppTheme): void {
    const root = document.documentElement; // <html>
    root.setAttribute("data-theme", theme);
  }

  private getInitialTheme(): AppTheme {
    const stored = localStorage.getItem(STORAGE_KEY) as AppTheme | null;
    if (stored === "light" || stored === "dark") return stored;

    // Optional: default to system preference if nothing stored
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
    return prefersDark ? "dark" : "light";
  }
}
