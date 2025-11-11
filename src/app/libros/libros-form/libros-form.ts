// src/app/libros/libros-form/libros-form.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormControl
} from '@angular/forms';
import { LibroService } from '../../services/libro.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Libro } from '../../models/libro';

@Component({
  selector: 'app-libros-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './libros-form.html',
  styleUrls: ['./libros-form.scss']
})
export class LibrosForm implements OnInit {
  form!: FormGroup;

  id?: number;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private svc: LibroService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Creación segura del form (controls non-nullable)
    this.form = this.fb.group({
      titulo: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(255)]),
      autor: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(255)]),
      anio: this.fb.nonNullable.control(''),
      genero: this.fb.nonNullable.control('')
    });
  }

  // helpers tipados para la plantilla (opcional pero convenientes)
  get titulo(): FormControl<string> | null {
    return this.form.get('titulo') as FormControl<string> | null;
  }
  get autor(): FormControl<string> | null {
    return this.form.get('autor') as FormControl<string> | null;
  }
  get anio(): FormControl<string> | null {
    return this.form.get('anio') as FormControl<string> | null;
  }
  get genero(): FormControl<string> | null {
    return this.form.get('genero') as FormControl<string> | null;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.cargar(this.id);
    }
  }

  cargar(id: number) {
    this.loading = true;
    this.svc.obtenerPorId(id).subscribe({
      next: data => {
        this.form.patchValue({
          titulo: data.titulo ?? '',
          autor: data.autor ?? '',
          anio: data.anio ?? '',
          genero: data.genero ?? ''
        });
        this.loading = false;
      },
      error: e => {
        console.error(e);
        this.loading = false;
      }
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.value as Omit<Libro, 'id'>;

    this.loading = true;
    if (this.id) {
      this.svc.actualizar(this.id, payload).subscribe({
        next: _ => { this.loading = false; this.router.navigate(['/']); },
        error: e => { console.error(e); this.loading = false; }
      });
    } else {
      this.svc.crear(payload).subscribe({
        next: _ => { this.loading = false; this.router.navigate(['/']); },
        error: e => { console.error(e); this.loading = false; }
      });
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
