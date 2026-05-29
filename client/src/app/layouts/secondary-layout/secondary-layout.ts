import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../widgets/header/header';

@Component({
  selector: 'app-secondary-layout',
  imports: [RouterOutlet, Header],
  templateUrl: './secondary-layout.html',
  styleUrl: './secondary-layout.scss',
})
export class SecondaryLayout {}
