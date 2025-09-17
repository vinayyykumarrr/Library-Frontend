
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../../core/services/reservation.service';

import { Reservation } from '../../../core/models/reservation';

@Component({
  selector: 'app-admin-reservation-list',
  standalone: true,
  imports: [CommonModule],

  templateUrl: './admin-reservation-list.component.html',
  styleUrls: ['./admin-reservation-list.component.css']
})
export class AdminReservationListComponent {
  rows = signal<Reservation[]>([]);
  constructor(private svc: ReservationService){ this.load(); }
  load(){ this.svc.listAll().subscribe(rs => this.rows.set(rs)); }
  markReturned(id: number){ this.svc.updateStatus(id, 'RETURNED').subscribe(_ => this.load()); }
  remove(id: number){ if(confirm('Delete?')) this.svc.delete(id).subscribe(_ => this.load()); }
}
