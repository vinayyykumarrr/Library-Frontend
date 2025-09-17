
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../../core/services/reservation.service';

import { Reservation } from '../../../core/models/reservation';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule],

  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent {
  rows = signal<Reservation[]>([]);
  constructor(private svc: ReservationService){ this.load(); }
  load(){ const uid = Number(localStorage.getItem('uid')); if (!uid) return; this.svc.listByUser(uid).subscribe(rs => this.rows.set(rs)); }
}
