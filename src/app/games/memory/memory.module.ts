import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemoryComponent } from './memory.component';
import { CardComponent } from './card/card.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: MemoryComponent,
  },
];

@NgModule({
  declarations: [MemoryComponent, CardComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class MemoryModule {}
