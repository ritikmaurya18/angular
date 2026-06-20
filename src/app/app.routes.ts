import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then((m) => m.LoginPage),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then((m) => m.DashboardPage),
  },
  {
    path: 'todos',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/todo-list/todo-list').then((m) => m.TodoListPage),
  },
  {
    path: 'todos/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/todo-detail/todo-detail').then((m) => m.TodoDetailPage),
  },
  {
    path: 'categories',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/categories/categories').then((m) => m.CategoriesPage),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profile/profile').then((m) => m.ProfilePage),
  },
  { path: '**', redirectTo: '' },
];
