import { Component, input, output } from '@angular/core';
import { Button } from '../button/button';
import { Icon } from '../icon/icon.component';

@Component({
  selector: 'app-alert-message',
  imports: [Button, Icon],
  templateUrl: './alert-message.html',
  styleUrl: './alert-message.scss',
})
export class AlertMessage {
  isOpen = input.required<boolean>();
  actOnClose = output<void>();
  dismissible = input(true);
}
