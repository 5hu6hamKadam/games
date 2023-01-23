import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
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
  @Input()
  public input!: string;
  @Output()
  public inputChange = new EventEmitter<string>();

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  public onUserInput(event: any) {
    this.inputChange.next(event.target.value);
  }
}
