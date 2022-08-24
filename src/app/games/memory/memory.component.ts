import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  bufferCount,
  delay,
  from,
  map,
  merge,
  mergeMap,
  Observable,
  pairwise,
  repeat,
  tap,
  toArray,
} from 'rxjs';
import { CardComponent } from './card/card.component';

const icons = [
  'fa-bath',
  'fa-shower',
  'fa-snowflake-o',
  'fa-anchor',
  'fa-asterisk',
  'fa-car',
  'fa-balance-scale',
  'fa-bell-o',
  'fa-bomb',
  'fa-certificate',
  'fa-coffee',
];

@Component({
  selector: 'app-memory',
  templateUrl: './memory.component.html',
  styleUrls: ['./memory.component.scss'],
})
export class MemoryComponent implements OnInit, AfterViewInit {
  cards$!: Observable<string[]>;

  @ViewChildren(CardComponent)
  cards!: QueryList<CardComponent>;

  constructor() {
    this.initializeCards();
  }

  ngAfterViewInit(): void {
    merge(...this.cards.map((card) => card.flipped.asObservable()))
      .pipe(
        bufferCount(2, 2),
        delay(1000),
        tap(([first, second]) => {
          const firstCard = this.cards.get(first.index);
          const secondCard = this.cards.get(second.index);
          if (firstCard && secondCard) {
            if (first.logo === second.logo) {
              firstCard.hide();
              secondCard.hide();
            } else {
              firstCard.flip();
              secondCard.flip();
            }
          }
        })
      )
      .subscribe();
  }

  ngOnInit(): void {}

  private initializeCards() {
    this.cards$ = from(this.shuffle(icons).slice(0, 6)).pipe(
      repeat(2),
      toArray(),
      map((v) => this.shuffle(v))
    );
  }

  private shuffle(array: string[]): string[] {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }
}
