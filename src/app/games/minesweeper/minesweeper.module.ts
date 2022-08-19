import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MinesweeperComponent } from './minesweeper.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: MinesweeperComponent,
  },
];

@NgModule({
  declarations: [MinesweeperComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class MinesweeperModule {}
