import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { TypingTutorService } from 'src/app/services/typing-tutor.service';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.scss'],
})
export class ScreenComponent implements OnInit, OnDestroy {
  @Input()
  public drill!: string;
  @Input()
  public activeDrillIndex!: number | null;
  @Input()
  public drillLength!: number;
  public userInput = '';

  private ngUnsubscribe$ = new Subject();
  constructor(private typingTutorService: TypingTutorService) {}

  ngOnInit(): void {
    this.listenClearInput();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next(true);
    this.ngUnsubscribe$.complete();
  }
  public onUserInput(event: any) {
    this.typingTutorService.setInput(event.target.value);
  }

  private listenClearInput() {
    this.typingTutorService.drill$
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        tap(() => {
          this.userInput = '';
          this.typingTutorService.setInput('');
        })
      )
      .subscribe();
  }
}
