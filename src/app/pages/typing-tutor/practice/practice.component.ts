import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { DrillService } from 'src/app/services/drill.service';
import { TypingTutorService } from 'src/app/services/typing-tutor.service';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss'],
})
export class PracticeComponent implements OnInit {
  constructor(
    private router: ActivatedRoute,
    private drillService: DrillService,
    private logger: NGXLogger
  ) {}
  ngOnInit(): void {
    const mode = this.router.snapshot.params['mode'];
    this.logger.debug(
      'PracticeComponent : ngOnInit : entering with mode',
      mode
    );
    this.drillService.loadDrillSet(mode);
  }
}
