import { Component } from '@angular/core';
import { SearchFilters } from '../../../features/ui/search-filters/search-filters';

@Component({
  selector: 'app-search-page',
  imports: [SearchFilters],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss',
})
export default class SearchPage {}
