import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'typing-tutor',
    loadChildren: () =>
      import('./pages/typing-tutor/typing-tutor.module').then(
        (m) => m.TypingTutorModule
      ),
  },
  {
    path: 'memory',
    loadChildren: () =>
      import('./pages/memory/memory.module').then((m) => m.MemoryModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
