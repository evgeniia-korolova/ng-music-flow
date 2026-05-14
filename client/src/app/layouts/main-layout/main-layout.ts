import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../widgets/footer/footer';
import { Header } from '../../widgets/header/header';

@Component({
  selector: 'app-main-layout',
  imports: [Header, Footer, RouterOutlet],
  templateUrl: './main-layout.html',
})
export class MainLayout {}
