import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibroService } from '../../services/libro.service';
import { Libro } from '../../models/libro';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-libros-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './libros-list.html',
  styleUrls: ['./libros-list.scss']
})
export class LibrosList {
  libros = signal<Libro[]>([]);
  page = signal(0);
  size = signal(10);
  totalPages = signal(0);
  totalElements = signal(0);
  loading = signal(false);

  // control simple de orden
  sort = signal('titulo,asc');

  constructor(private svc: LibroService, private router: Router) {
    this.cargar();
  }

  cargar(page = 0) {
    this.loading.set(true);
    this.svc.listar(page, this.size(), this.sort()).subscribe({
      next: resp => {
        this.libros.set(resp.content);
        this.page.set(resp.page);
        this.size.set(resp.size);
        this.totalPages.set(resp.totalPages);
        this.totalElements.set(resp.totalElements);
        this.loading.set(false);
      },
      error: err => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  onNew() {
    this.router.navigate(['new']);
  }

  onEdit(id?: number) {
    if (id != null) this.router.navigate([`/${id}`]);
  }

  onDelete(id?: number) {
    if (!id) return;
    if (!confirm('¿Eliminar este libro?')) return;
    this.svc.eliminar(id).subscribe({
      next: () => this.cargar(this.page()),
      error: e => console.error(e)
    });
  }

  previous() {
    if (this.page() > 0) this.cargar(this.page() - 1);
  }

  next() {
    if (this.page() < this.totalPages() - 1) this.cargar(this.page() + 1);
  }
}
