// src/app/app.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <nav class="navbar">
      <a routerLink="/">Libros</a>
      <a routerLink="/new">Nuevo</a>
      <a routerLink="/login" *ngIf="!auth.isAuthenticated()">Iniciar sesión</a>
      <button *ngIf="auth.isAuthenticated()" (click)="logout()">Cerrar sesión</button>
    </nav>
    <main class="main">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar { background:#222; color:#fff; padding: 1rem; display:flex; gap:1rem; align-items:center; }
    .navbar a, .navbar button { color: #fff; text-decoration: none; background: transparent; border: none; cursor: pointer; }
    .main { padding: 1rem; }
  `]
})
export class App {
  constructor(public auth: AuthService, private router: Router) {}

  logout() {
    this.auth.clearCredentials();
    this.router.navigate(['/login']);
  }
}