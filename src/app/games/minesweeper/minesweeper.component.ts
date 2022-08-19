import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, first, generate, map, tap, toArray } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

interface ISlot {
  isHidden: boolean;
  isBomb: boolean;
  isFlag: boolean;
  value: number;
}

@Component({
  selector: 'app-minesweeper',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.scss'],
})
export class MinesweeperComponent implements OnInit {
  public slots$ = new BehaviorSubject<ISlot[]>([]);
  public isFlag = false;
  public isWin = false;
  private readonly indices = [1, -9, 11];
  constructor() {
    generate(
      0,
      (i) => i < 100,
      (i) => i + 1,
      (_) =>
        <ISlot>{
          isBomb: false,
          isFlag: false,
          isHidden: true,
          value: 0,
        }
    )
      .pipe(
        toArray(),
        first(),
        map((slots) => {
          Array(10)
            .fill(0)
            .forEach((_: number) => {
              const max = 99,
                min = 0;
              const random = Math.floor(Math.random() * (max - min + 1) + min);
              console.log('random', random);
              slots[random].isBomb = true;
            });
          slots.forEach((slot, index) => {
            this.indices.forEach((i) => {
              if ((index + 1) % 10 !== 0 && slots[index + i]?.isBomb) {
                slot.value++;
              }
              if (index % 10 !== 0 && slots[index - i]?.isBomb) {
                slot.value++;
              }
            });
            if (slots[index - 10]?.isBomb) {
              slot.value++;
            }
            if (slots[index + 10]?.isBomb) {
              slot.value++;
            }
          });
          return slots;
        }),
        tap((slots) => this.slots$.next(slots))
      )
      .subscribe();
  }

  ngOnInit(): void {}

  private checkIfWin(): boolean {
    const slots = this.slots$.value;
    const hidden = slots.reduce((acc, { isBomb, isHidden }) => {
      if (!isBomb && isHidden) {
        acc++;
      }
      return acc;
    }, 0);
    return hidden === 0;
  }
  public onSlotSelect(index: number) {
    const slots = this.slots$.value;
    const slot = slots[index];
    if (this.isFlag) {
      slot.isFlag = !slot.isFlag;
    } else {
      if (slot.isBomb) {
        slots.forEach((slot) => (slot.isHidden = false));
      } else {
        slot.isHidden = false;
        if (!slot.value) {
          this.indices.forEach((i) => {
            if (
              (index + 1) % 10 !== 0 &&
              slots[index + i] &&
              !slots[index + i]?.isBomb
            ) {
              slots[index + i].isHidden = false;
            }
            if (
              index % 10 !== 0 &&
              slots[index - i] &&
              !slots[index - i]?.isBomb
            ) {
              slots[index - i].isHidden = false;
            }
          });
        }
        if (slots[index - 10] && !slots[index - 10]?.isBomb) {
          slots[index - 10].isHidden = false;
        }
        if (slots[index + 10] && !slots[index + 10]?.isBomb) {
          slots[index + 10].isHidden = false;
        }
      }
    }
    this.slots$.next(slots);
    this.isWin = this.checkIfWin();
  }
}
