import { Component } from '@angular/core';
import { MENU_ITEMS } from './types/constants';

@Component({
  selector: 'app-typing-tutor',
  templateUrl: './typing-tutor.component.html',
  styleUrls: ['./typing-tutor.component.scss'],
})
export class TypingTutorComponent {
  public menuItems = MENU_ITEMS;
}
