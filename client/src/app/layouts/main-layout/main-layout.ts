import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../widgets/footer/footer';
import { Header } from '../../widgets/header/header';
import { SearchBar } from '../../widgets/search-bar/search-bar';
import { Breadcrumbs } from '../../widgets/breadcrumbs/breadcrumbs';
import { SearchToggleService } from '../../features/search/services/search-toggle-service';
import { GlobalPlayer } from '../../features/global-player/global-player';

@Component({
  selector: 'app-main-layout',
  imports: [Header, Footer, RouterOutlet, SearchBar, Breadcrumbs, GlobalPlayer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  protected readonly searchService = inject(SearchToggleService);
}
