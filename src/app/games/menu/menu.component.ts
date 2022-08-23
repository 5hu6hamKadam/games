import { Component, OnInit } from '@angular/core';

interface IMenuItem {
  src: string;
  title: string;
  path: string;
}
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  public menuItems: IMenuItem[] = [
    {
      title: 'Minesweeper',
      path: 'minesweeper',
      src: '../../../assets/images/minesweeper.jpg',
    },
    {
      title: 'Flappy bird',
      path: 'flappy-bird',
      src: '../../../assets/images/minesweeper.jpg',
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
