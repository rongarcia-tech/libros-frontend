import { Routes } from '@angular/router';
import { LibrosList } from './libros/libros-list/libros-list';
import { LibrosForm } from './libros/libros-form/libros-form';
import { authGuardFn } from './auth/auth.guard';
import { LoginComponent } from './auth/login';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: LibrosList, canActivate: [authGuardFn] },
  { path: 'new', component: LibrosForm, canActivate: [authGuardFn] },
  { path: ':id', component: LibrosForm, canActivate: [authGuardFn] },
  { path: '**', redirectTo: '' }
];