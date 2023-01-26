import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  from,
  fromEvent,
  map,
  Subject,
  take,
  takeUntil,
  tap,
  toArray,
} from 'rxjs';
import { DrillService } from 'src/app/services/drill.service';
import { KeyboardService } from 'src/app/services/keyboard.service';
import { PalmService } from 'src/app/services/palm.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit, OnDestroy {
  public displayDrill$ = new BehaviorSubject<string>('');
  public fingerIndex$ = this.palmService.nextFinger$;
  public keyboardKey$ = this.keyboardService.nextKey$;
  public drillIndex$ = this.drillService.activeDrillIndex$;
  public drillLength$ = this.drillService.drillLength$;
  public userInput = '';

  private ngUnsubscribe$ = new Subject();

  constructor(
    private drillService: DrillService,
    private keyboardService: KeyboardService,
    private palmService: PalmService
  ) {}

  ngOnInit(): void {
    this.listenDrillSetChange();
    this.listenDrillChange();
    this.listenDrillNavigation();
  }

  public onUserInput(input: string) {
    const drill = this.drillService.getActiveDrill();

    if (input[input.length - 1] !== drill[input.length - 1]) {
      this.playSound('failed');
    }
    from(input)
      .pipe(
        tap(() => {
          this.keyboardService.setNextKey(drill[input.length]);
          this.palmService.setNextFinger(drill[input.length]);
        }),
        map((char, charIndex) => {
          if (char !== drill[charIndex]) {
            return `<span class="text-red-500">${drill[charIndex]}</span>`;
          }
          return char;
        }),
        toArray(),
        map(
          (v) =>
            v.join('') +
            `<span class="bg-black text-white">${drill[v.length]}</span>` +
            drill.slice(v.length + 1)
        ),
        take(1),
        tap((v) => this.displayDrill$.next(v))
      )
      .subscribe();
    if (input.length === drill.length) {
      this.playSound('success');
      this.drillService.nextDrill();
      this.userInput = '';
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next(true);
    this.ngUnsubscribe$.complete();
  }

  private listenDrillSetChange() {
    this.drillService.drillList$
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        tap(() => this.drillService.setDrillIndex(0))
      )
      .subscribe();
  }

  private listenDrillChange() {
    this.drillService.drill$
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        tap((v) =>
          this.displayDrill$.next(
            `<span class="bg-black text-white">${v[0]}</span>${v.slice(1)}`
          )
        ),
        tap((v) => this.keyboardService.setNextKey(v[0])),
        tap((v) => this.palmService.setNextFinger(v[0]))
      )
      .subscribe();
  }

  private listenDrillNavigation() {
    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        tap(({ code }) => {
          if (code === 'ArrowRight') {
            this.drillService.nextDrill();
          } else if (code === 'ArrowLeft') {
            this.drillService.prevDrill();
          }
        })
      )
      .subscribe();
  }

  private playSound(type: 'success' | 'failed') {
    const audio = new Audio();
    audio.src = `/assets/${type}.mp3`;
    audio.load();
    audio.play();
  }
}
