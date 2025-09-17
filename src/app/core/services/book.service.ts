
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Book } from '../models/book';

@Injectable({ providedIn: 'root' })
export class BookService {
  private base = environment.apiUrl + '/api/books';
  constructor(private http: HttpClient) {}
  list(query?: string){
    let params = new HttpParams();
    if (query) params = params.set('q', query);
    return this.http.get<Book[]>(this.base, { params });
  }
  get(id: number){ return this.http.get<Book>(`${this.base}/${id}`); }
  create(book: Partial<Book>){ return this.http.post<Book>(this.base, book); }
  update(id: number, book: Partial<Book>){ return this.http.put<Book>(`${this.base}/${id}`, book); }
  delete(id: number){ return this.http.delete<void>(`${this.base}/${id}`); }
}
