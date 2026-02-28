import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/presenter-picker/components/presenter-page/presenter-page.component').then(m => m.PresenterPageComponent) },
  { path: '**', redirectTo: '' }
];
