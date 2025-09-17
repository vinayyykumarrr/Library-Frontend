import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Reservation } from '../models/reservation';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private base = environment.apiUrl + '/api';
  constructor(private http: HttpClient) {}

  // Convert various inputs to YYYY-MM-DD (what most Spring DTOs accept)
  private normalizeDate(d: string): string {
    if (!d) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;               // already YYYY-MM-DD
    const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(d);              // dd-MM-yyyy
    if (m) return `${m[3]}-${m[2]}-${m[1]}`;
    const dt = new Date(d);
    if (!isNaN(dt.getTime())) {
      // strip TZ offset
      return new Date(dt.getTime() - dt.getTimezoneOffset()*60000)
        .toISOString().slice(0,10);
    }
    return d;
  }

  // Send both nested + flat ids to match common Spring payloads
  createForBook(bookId: number, issueDate: string, returnDate: string){
    const uidStr = localStorage.getItem('uid');
    const userId = uidStr ? Number(uidStr) : undefined;

    const body: any = {
      books: { id: bookId },
      book_id: bookId,                           // flat field (extra)
      issue_date: this.normalizeDate(issueDate),
      return_date: this.normalizeDate(returnDate),
      status: 'ACTIVE'
    };
    if (Number.isFinite(userId)) {
      body.users = { id: userId };               // nested user
      body.user_id = userId;                     // flat field (extra)
    }

    return this.http.post<Reservation>(`${this.base}/reservations`, body);
  }

  listByUser(userId: number){
    return this.http.get<Reservation[]>(`${this.base}/users/${userId}/reservations`);
  }
  listAll(){
    return this.http.get<Reservation[]>(`${this.base}/admin/reservations`);
  }
  updateStatus(id: number, status: 'ACTIVE'|'RETURNED'){
    return this.http.put<Reservation>(`${this.base}/reservations/${id}`, { status });
  }
  delete(id: number){ return this.http.delete<void>(`${this.base}/reservations/${id}`); }
}
