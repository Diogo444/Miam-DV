import { Component, AfterViewInit, ChangeDetectionStrategy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

@Component({
  selector: 'app-ad-banner',
  template: `
    <div class="mt-8 flex justify-center">
      <div class="w-full max-w-4xl rounded-xl border border-primary-light/40 bg-primary-light/10 p-4 dark:border-primary/20 dark:bg-primary/5">
        <p class="mb-2 text-center text-xs text-text-muted/60 dark:text-primary/50">Publicité</p>
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-6031484816129735"
             data-ad-slot="4749732240"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdBanner implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }
}
