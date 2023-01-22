import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public appList = [
    {
      class: 'bg-green-300 text-white',
      label: 'Typing tutor',
      link: '/typing-tutor',
    },
  ];
}
