import { Component } from '@angular/core';
import { Button } from '../../shared/ui/button/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [Button, RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound {}
