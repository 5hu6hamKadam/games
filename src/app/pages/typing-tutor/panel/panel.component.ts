import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  fromEvent,
  map,
  scan,
  Subject,
  takeUntil,
  tap,
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
    this.keyboardService.setNextKey(drill[input.length]);
    this.palmService.setNextFinger(drill[input.length]);
    if (input[input.length - 1] !== drill[input.length - 1]) {
      this.playSound('failed');
    }
    const displayDrill =
      input
        .split('')
        .map((inputChar, inputIndex) => {
          if (inputChar === drill[inputIndex]) {
            return inputChar;
          } else {
            return `<span class="text-red-500">${drill[inputIndex]}</span>`;
          }
        })
        .join('') + drill.slice(input.length);
    this.displayDrill$.next(displayDrill);

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
        tap((v) => this.displayDrill$.next(v)),
        map((v) => v[0]),
        tap((v) => this.keyboardService.setNextKey(v)),
        tap((v) => this.palmService.setNextFinger(v))
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
