import { Component, effect, inject, input, signal } from '@angular/core';
import { ICON_REGISTRY, IconName } from './icon-registry';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

type IconVariant = 'outline' | 'fill';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [],
  template: `
    <div class="icon-container" [class.is-filled]="variant() === 'fill'">
      <div class="icon-embed" [innerHTML]="rawSvgContent()"></div>
    </div>
  `,
  styleUrl: './icon.component.scss',
  host: {
    '[style.--icon-primary]': 'primaryColor()',
    '[style.--icon-secondary]': 'secondaryColor()',
    '[style.--icon-fill]': 'fillColor()',
  },
})
export class Icon {
  private readonly sanitizer = inject(DomSanitizer);

  icon = input.required<IconName>();
  variant = input<IconVariant>('outline');

  primaryColor = input('currentColor');
  secondaryColor = input('currentColor');
  fillColor = input('var(--color-btn-ghost-bg)');

  protected rawSvgContent = signal<SafeHtml>('');

  constructor() {
    effect(async () => {
      const svg = ICON_REGISTRY[this.icon()];

      if (svg) {
        try {
          const rawString = await svg();

          const trustedHtml = this.sanitizer.bypassSecurityTrustHtml(rawString);

          this.rawSvgContent.set(trustedHtml);
          return;
        } catch {
          console.error('failed to load icon');
        }
      }

      console.error('icon not found');
    });
  }
}
