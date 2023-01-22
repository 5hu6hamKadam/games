import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TypingTutorService } from 'src/app/services/typing-tutor.service';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss'],
})
export class PracticeComponent implements OnInit {
  constructor(
    private router: ActivatedRoute,
    private typingTutorService: TypingTutorService
  ) {}
  ngOnInit(): void {
    const mode = this.router.snapshot.params['mode'];
    this.typingTutorService.setDrills(mode);
  }
}
