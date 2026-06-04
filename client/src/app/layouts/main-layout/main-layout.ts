import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../widgets/footer/footer';
import { Header } from '../../widgets/header/header';
import { SearchBar } from '../../widgets/search-bar/search-bar';
import { Breadcrumbs } from '../../widgets/breadcrumbs/breadcrumbs';

@Component({
  selector: 'app-main-layout',
  imports: [Header, Footer, RouterOutlet, SearchBar, Breadcrumbs],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {}
