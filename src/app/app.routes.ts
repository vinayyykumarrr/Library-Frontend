
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'books', loadComponent: () => import('./features/books/book-list/book-list.component').then(m => m.BookListComponent) },
  { path: 'books/:id', loadComponent: () => import('./features/books/book-detail/book-detail.component').then(m => m.BookDetailComponent) },
  { path: 'books/:id/reserve', canActivate: [authGuard], loadComponent: () => import('./features/reservations/reservation-create/reservation-create.component').then(m => m.ReservationCreateComponent) },
  { path: 'reservations', canActivate: [authGuard], loadComponent: () => import('./features/reservations/reservation-list/reservation-list.component').then(m => m.ReservationListComponent) },
  { path: 'admin/books', canActivate: [adminGuard], loadComponent: () => import('./features/admin/admin-book-list/admin-book-list.component').then(m => m.AdminBookListComponent) },
  { path: 'admin/books/new', canActivate: [adminGuard], loadComponent: () => import('./features/admin/admin-book-form/admin-book-form.component').then(m => m.AdminBookFormComponent) },
  { path: 'admin/books/:id', canActivate: [adminGuard], loadComponent: () => import('./features/admin/admin-book-form/admin-book-form.component').then(m => m.AdminBookFormComponent) },
  { path: 'admin/reservations', canActivate: [adminGuard], loadComponent: () => import('./features/admin/admin-reservation-list/admin-reservation-list.component').then(m => m.AdminReservationListComponent) },
  { path: '**', redirectTo: 'books' }
];
