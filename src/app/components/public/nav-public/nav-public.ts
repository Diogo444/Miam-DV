import { DOCUMENT } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-nav-public',
  standalone: true,
  imports: [],
  templateUrl: './nav-public.html',
  styleUrl: './nav-public.scss',
})
export class NavPublic implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private mediaQuery: MediaQueryList | null = null;
  private mediaQueryHandler?: (event: MediaQueryListEvent) => void;

  theme: 'light' | 'dark' = 'light';

  ngOnInit(): void {
    this.mediaQuery =
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null;

    this.applyTheme(this.resolveInitialTheme());

    if (this.mediaQuery) {
      this.mediaQueryHandler = event => {
        if (!this.getStoredTheme()) {
          this.applyTheme(event.matches ? 'dark' : 'light', false);
        }
      };
      this.mediaQuery.addEventListener('change', this.mediaQueryHandler);
    }
  }

  ngOnDestroy(): void {
    if (this.mediaQuery && this.mediaQueryHandler) {
      this.mediaQuery.removeEventListener('change', this.mediaQueryHandler);
    }
  }

  toggleTheme(): void {
    this.applyTheme(this.theme === 'dark' ? 'light' : 'dark');
  }

  private resolveInitialTheme(): 'light' | 'dark' {
    const stored = this.getStoredTheme();
    if (stored) {
      return stored;
    }
    if (this.mediaQuery?.matches) {
      return 'dark';
    }
    return 'light';
  }

  private getStoredTheme(): 'light' | 'dark' | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const stored = localStorage.getItem('theme');
    return stored === 'dark' || stored === 'light' ? stored : null;
  }

  private applyTheme(theme: 'light' | 'dark', persist = true): void {
    this.theme = theme;
    const htmlElement = this.document.documentElement;
    htmlElement.classList.toggle('dark', theme === 'dark');
    htmlElement.classList.toggle('light', theme === 'light');
    htmlElement.style.colorScheme = theme;
    htmlElement.dataset['theme'] = theme;
    if (persist && typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }
}
