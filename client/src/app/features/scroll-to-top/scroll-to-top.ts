import { Component, HostListener, signal } from '@angular/core';
import { Button } from '../../shared/ui/button/button';

@Component({
  selector: 'app-scroll-to-top',
  imports: [Button],
  templateUrl: './scroll-to-top.html',
  styleUrl: './scroll-to-top.scss',
})
export class ScrollToTop {
  protected isScrollButtonVisible = signal(false);

  @HostListener('window:scroll')
  onWindowScroll() {
    if (window.scrollY > 200) {
      this.isScrollButtonVisible.set(true);
    } else {
      this.isScrollButtonVisible.set(false);
    }
  }
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
