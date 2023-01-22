import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypingTutorComponent } from './typing-tutor.component';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './error/error.component';
import { KeyboardComponent } from './panel/keyboard/keyboard.component';
import { ScreenComponent } from './panel/screen/screen.component';
import { PalmComponent } from './panel/palm/palm.component';
import { FormsModule } from '@angular/forms';
import { PanelComponent } from './panel/panel.component';
import { PracticeComponent } from './practice/practice.component';

const routes: Routes = [
  {
    path: ':mode',
    component: PracticeComponent,
  },
  {
    path: '',
    component: TypingTutorComponent,
  },
  {
    path: '**',
    component: ErrorComponent,
  },
];

@NgModule({
  declarations: [
    TypingTutorComponent,
    ErrorComponent,
    KeyboardComponent,
    ScreenComponent,
    PalmComponent,
    PanelComponent,
    PracticeComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule],
})
export class TypingTutorModule {}
