import { Component, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, map, scan, Subject, takeUntil, tap } from 'rxjs';
import { TypingTutorService } from 'src/app/services/typing-tutor.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit, OnDestroy {
  public drill$ = this.typingTutorService.drill$;
  public nextCharIndex$ = this.typingTutorService.nextCharIndex$;
  public fingerIndex$ = this.typingTutorService.fingerIndex$;
  public keyboardKey$ = this.typingTutorService.keyboardKey$;

  private ngUnsubscribe$ = new Subject();

  constructor(private typingTutorService: TypingTutorService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next(true);
    this.ngUnsubscribe$.complete();
  }
}
