import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-palm',
  templateUrl: './palm.component.html',
  styleUrls: ['./palm.component.scss'],
})
export class PalmComponent {
  @Input()
  public activeFingerIndex!: number;
  @Input()
  public mode!: 'right' | 'left';

  public fingers = [
    'bg-yellow-400 rounded-t w-2 h-1/2',
    'bg-orange-500 rounded-t w-2 h-3/4',
    'bg-purple-500 rounded-t w-2 h-4/5',
    'bg-green-500 rounded-t w-2 h-3/5',
    'bg-red-500 rounded-t w-2 h-1/3',
  ];
}
