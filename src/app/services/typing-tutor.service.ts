import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TypingTutorService {
  public drill$ = new BehaviorSubject<string>('abcdefghijklmnopqrstuvwxyz');
  public fingerIndex$ = new BehaviorSubject<number>(
    this.findActiveFingerIndex(this.drill$.value[0])
  );
  public keyboardKey$ = new BehaviorSubject<string>(this.drill$.value[0]);
  public userInput$ = new BehaviorSubject<string>('');
  public nextCharIndex$ = new Subject<number>();

  constructor() {
    this.listenInputChange();
    // this.setActiveFingerIndex(this.drill$.value[0]);
  }

  public setInput(inputVal: string) {
    this.userInput$.next(inputVal);
  }

  private findActiveFingerIndex(char: string): number {
    const fingers = [
      [1, '!', 'Q', 'A', 'Z'],
      [2, '@', 'W', 'S', 'X'],
      [3, '#', 'E', 'D', 'C'],
      [4, '$', 'R', 'T', 'F', 'G', 'V', 'B'],
      [' '],
      [' '],
      [4, '$', 'Y', 'U', 'H', 'J', 'N', 'M'],
      [5, '%', 'I', 'K', ','],
      [7, '&', 'O', 'L', '.'],
      [9, '(', 'Q', 'A', 'Z'],
      ['p', ';', '/', '-', '[', ']', '{', '}', "'", '=', '/', '\\', '|', '?'],
    ];

    return fingers.findIndex((v) => v.includes(char.toUpperCase()));
  }

  private setActiveFingerIndex(char: string): void {
    const index = this.findActiveFingerIndex(char);
    this.fingerIndex$.next(index + 1);
  }

  private listenInputChange() {
    this.userInput$
      .pipe(
        tap((v) => this.nextCharIndex$.next(v.length)),
        tap((v) => {
          if (this.drill$.value[v.length]) {
            this.setActiveFingerIndex(this.drill$.value[v.length]);
            this.keyboardKey$.next(this.drill$.value[v.length]);
          }
        })
      )
      .subscribe();
  }
}
