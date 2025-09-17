
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private base = environment.apiUrl + '/api/users';
  constructor(private http: HttpClient) {}
  get(id: number){ return this.http.get<User>(`${this.base}/${id}`); }
}
