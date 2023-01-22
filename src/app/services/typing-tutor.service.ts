import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  filter,
  from,
  map,
  mergeMap,
  Subject,
  tap,
  toArray,
  zip,
} from 'rxjs';
import drills from '../../assets/data/drill.json';
import sentence from '../../assets/data/sentence.json';
import paragraph from '../../assets/data/paragraph.json';
@Injectable({
  providedIn: 'root',
})
export class TypingTutorService {
  public drill$ = new BehaviorSubject<string>('test');
  public displayDrill$ = new BehaviorSubject<string>('');
  public fingerIndex$ = new BehaviorSubject<number>(1);
  public keyboardKey$ = new BehaviorSubject<string>('');
  public userInput$ = new BehaviorSubject<string>('');
  public nextCharIndex$ = new Subject<number>();
  public drillList$ = new BehaviorSubject<string[]>([]);
  public activeDrillIndex$ = new BehaviorSubject<number>(0);

  constructor(private router: Router) {
    this.drill$
      .pipe(
        tap((v) => {
          this.displayDrill$.next(v);
          this.fingerIndex$.next(this.findActiveFingerIndex(v[0]));
          this.keyboardKey$.next(v[0]);
          this.listenInputChange();
          this.verifyDrill();
        })
      )
      .subscribe();
  }

  public setInput(inputVal: string) {
    this.userInput$.next(inputVal);
  }

  public setDrills(mode: string) {
    switch (mode) {
      case 'course':
        this.drillList$.next(drills);
        break;
      case 'sentence':
        this.drillList$.next(sentence);
        break;
      case 'paragraph':
        this.drillList$.next(paragraph);
        break;

      default:
        break;
    }
    this.drill$.next(this.drillList$.value[0]);
  }

  public nextDrill() {
    if (this.activeDrillIndex$.value === this.drillList$.value.length - 1) {
      return;
    }
    this.activeDrillIndex$.next(this.activeDrillIndex$.value + 1);
    const drill = this.drillList$.value[this.activeDrillIndex$.value];
    if (drill) {
      this.drill$.next(drill);
    }
  }

  public prevDrill() {
    if (this.activeDrillIndex$.value === 0) {
      return;
    }
    this.activeDrillIndex$.next(this.activeDrillIndex$.value - 1);
    const drill = this.drillList$.value[this.activeDrillIndex$.value];
    if (drill) {
      this.drill$.next(drill);
    }
  }

  private findActiveFingerIndex(char: string): number {
    if (!char) {
      return 0;
    }
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
                if (index === this.userInput$.value.length - 1 && index !== 0) {
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
      this.nextDrill();
    }
  }

  private playSound(type: 'success' | 'failed') {
    const audio = new Audio();
    audio.src = `/assets/${type}.mp3`;
    audio.load();
    audio.play();
  }
}
