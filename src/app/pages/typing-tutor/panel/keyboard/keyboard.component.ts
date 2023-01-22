import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss'],
})
export class KeyboardComponent {
  @Input()
  public activeChar!: string;
  public row1 = [
    '~`',
    '!1',
    '@2',
    '#3',
    '$4',
    '%5',
    '^6',
    '&7',
    '*8',
    '(9',
    ')0',
    '_-',
    '+=',
  ];
  public row2 = [
    'q',
    'w',
    'e',
    'r',
    't',
    'y',
    'u',
    'i',
    'o',
    'p',
    '{[',
    '}]',
    '|\\',
  ];
  public row3 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ':;', '"\''];
  public row4 = ['z', 'x', 'c', 'v', 'b', 'n', 'm', '<,', '>.', '?/'];
}
