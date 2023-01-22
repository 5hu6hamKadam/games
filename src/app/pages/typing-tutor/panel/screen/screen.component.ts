import { Component, Input } from '@angular/core';
import { TypingTutorService } from 'src/app/services/typing-tutor.service';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.scss'],
})
export class ScreenComponent {
  @Input()
  public drill!: string;
  public userInput = '';

  constructor(private typingTutorService: TypingTutorService) {}

  public onUserInput(event: any) {
    this.typingTutorService.setInput(event.target.value);
  }
}
