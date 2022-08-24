import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
export interface IFlipped {
  index: number;
  logo: string;
}
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input('index')
  index!: number;
  @Input('logo')
  logo!: string;

  @Output() flipped = new EventEmitter<IFlipped>();

  public isHidden = false;
  public isFlipped = false;

  constructor() {}

  ngOnInit(): void {}

  public hide() {
    this.isHidden = true;
  }

  public flip() {
    this.isFlipped = !this.isFlipped;
  }

  public onClick() {
    this.flip();
    this.flipped.emit({ index: this.index, logo: this.logo });
  }
}
