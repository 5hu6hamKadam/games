import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  bufferCount,
  delay,
  every,
  filter,
  from,
  map,
  mergeMap,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
interface ICard {
  label: number;
  class?: string;
}
@Component({
  selector: 'app-memory',
  templateUrl: './memory.component.html',
  styleUrls: ['./memory.component.scss'],
})
export class MemoryComponent implements OnInit, OnDestroy {
  public cardList!: ICard[];
  public userInput$ = new Subject<{
    card: number;
    index: number;
  }>();
  public gameOver$ = new Subject<boolean>();
  private ngUnsubscribe$ = new Subject();

  constructor() {
    this.getNewDeck();
  }
  ngOnInit(): void {
    this.listenUserInput();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next(true);
    this.ngUnsubscribe$.complete();
  }

  private listenUserInput() {
    this.userInput$
      .asObservable()
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        tap((v) => (this.cardList[v.index].class = 'turn')),
        bufferCount(2),
        delay(400),
        tap(([first, second]) => {
          if (first.card !== second.card) {
            this.cardList[first.index].class = '';
            this.cardList[second.index].class = '';
          } else {
            this.cardList[first.index].class = 'white-bg';
            this.cardList[second.index].class = 'white-bg';
          }
        }),
        filter(([first, second]) => first.card === second.card),
        tap(([first, second]) => {
          [first.index, second.index].forEach((v) => {
            this.cardList[v].label = 0;
          });
        }),
        map(() => from(this.cardList)),
        mergeMap((v) => v.pipe(every(({ label }) => label === 0))),
        filter((v) => !!v),
        tap(() => this.gameOver$.next(true)),
        delay(1000),
        tap(() => this.getNewDeck()),
        tap(() => this.gameOver$.next(false))
      )
      .subscribe();
  }

  private getNewDeck(): void {
    const list = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6].map((label) => ({
      label,
    }));
    this.cardList = this.shuffle(list);
  }

  private shuffle(array: ICard[]) {
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
