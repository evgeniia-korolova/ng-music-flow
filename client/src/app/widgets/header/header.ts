import { Component } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';

@Component({
  selector: 'app-header',
  imports: [LucideDynamicIcon],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
