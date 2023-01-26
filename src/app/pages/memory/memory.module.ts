import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemoryComponent } from './memory.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: MemoryComponent,
  },
];

@NgModule({
  declarations: [MemoryComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class MemoryModule {}
