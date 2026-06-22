import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../widgets/footer/footer';
import { Header } from '../../widgets/header/header';
import { SearchBar } from '../../widgets/search-bar/search-bar';
import { Breadcrumbs } from '../../widgets/breadcrumbs/breadcrumbs';
import { SearchToggleService } from '../../features/search/services/search-toggle-service';
import { GlobalPlayer } from '../../features/global-player/global-player';
import { AudioPlayerService } from '../../shared/services/audio-player/audio-player-service';

@Component({
  selector: 'app-main-layout',
  imports: [Header, Footer, RouterOutlet, SearchBar, Breadcrumbs, GlobalPlayer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  host: {
    //'[class.player-is-open]': '!!playerService.currentTrack()',
    '[class.player-is-open]': 'isPlayerExpanded()',
  },
})
export class MainLayout {
  protected readonly searchService = inject(SearchToggleService);
  protected playerService = inject(AudioPlayerService);

  readonly isPlayerExpanded = computed(() => {
    const hasTrack = !!this.playerService.currentTrack();
    const isMinimized = this.playerService.isMinimized();

    return hasTrack && !isMinimized;
  });
}
