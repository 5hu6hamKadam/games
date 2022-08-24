import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'menu',
    loadChildren: () =>
      import('./games/menu/menu.module').then((m) => m.MenuModule),
  },
  {
    path: 'minesweeper',
    loadChildren: () =>
      import('./games/minesweeper/minesweeper.module').then(
        (m) => m.MinesweeperModule
      ),
  },
  {
    path: 'flappy-bird',
    loadChildren: () =>
      import('./games/flappy-bird/flappy-bird.module').then(
        (m) => m.FlappyBirdModule
      ),
  },
  {
    path: 'memory',
    loadChildren: () =>
      import('./games/memory/memory.module').then((m) => m.MemoryModule),
  },
  {
    path: '',
    redirectTo: 'menu',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
