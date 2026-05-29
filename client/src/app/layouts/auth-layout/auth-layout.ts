import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../widgets/header/header';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, Header],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class SecondaryLayout {}
