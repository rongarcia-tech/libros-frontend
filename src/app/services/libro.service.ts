import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Libro } from '../models/libro';
import { PageResponse } from '../models/pageresponse';

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  // Si usas proxy.conf.json, usa /api como prefijo:
  private base = '/api/libros'; // => proxy -> http://localhost:8080/libros

  constructor(private http: HttpClient) {}

  listar(page = 0, size = 10, sort = 'titulo,asc'): Observable<PageResponse<Libro>> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('sort', sort);
    return this.http.get<PageResponse<Libro>>(this.base, { params });
  }

  obtenerPorId(id: number): Observable<Libro> {
    return this.http.get<Libro>(`${this.base}/${id}`);
  }

  crear(payload: Omit<Libro, 'id'>): Observable<Libro> {
    return this.http.post<Libro>(this.base, payload);
  }

  actualizar(id: number, payload: Omit<Libro, 'id'>): Observable<Libro> {
    return this.http.put<Libro>(`${this.base}/${id}`, payload);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
