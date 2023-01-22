import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  from,
  map,
  mergeMap,
  Subject,
  tap,
  toArray,
  zip,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TypingTutorService {
  public drill$ = new BehaviorSubject<string>('abcdefghijklmnopqrstuvwxyz');
  public displayDrill$ = new BehaviorSubject<string>(this.drill$.value);
  public fingerIndex$ = new BehaviorSubject<number>(
    this.findActiveFingerIndex(this.drill$.value[0])
  );
  public keyboardKey$ = new BehaviorSubject<string>(this.drill$.value[0]);
  public userInput$ = new BehaviorSubject<string>('');
  public nextCharIndex$ = new Subject<number>();

  constructor() {
    this.listenInputChange();
    this.verifyDrill();
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

  private listenInputChange(): void {
    this.userInput$
      .pipe(
        tap((v) => this.nextCharIndex$.next(v.length)),
        tap((v) => {
          const char = this.drill$.value[v.length];
          if (char) {
            this.setActiveFingerIndex(char);
            this.keyboardKey$.next(char);
          }
        })
      )
      .subscribe();
  }

  private verifyDrill() {
    this.userInput$
      .pipe(
        map((v) => zip(from(v), from(this.drill$.value))),
        mergeMap((v) =>
          v.pipe(
            map(([i, j], index) => {
              let value;
              if (i === j) {
                value = j;
              } else {
                value = `<span class="text-red-500">${j}</span>`;
                if (index === this.userInput$.value.length - 1) {
                  this.playSound('failed');
                }
              }
              return value;
            }),
            toArray()
          )
        ),
        map(
          (v) =>
            v.join('') +
            `<span class="bg-black text-white">${
              this.drill$.value[v.length] || ''
            }</span>` +
            this.drill$.value.slice(v.length + 1)
        ),
        tap((v) => this.displayDrill$.next(v)),
        tap((v) => this.checkDrillCompleted())
      )
      .subscribe();
  }

  private checkDrillCompleted() {
    if (this.userInput$.value.length === this.drill$.value.length) {
      this.playSound('success');
    }
  }
  private playSound(type: 'success' | 'failed') {
    var audio = new Audio();
    audio.src = `/assets/${type}.mp3`;
    audio.load();
    audio.play();
  }
}
