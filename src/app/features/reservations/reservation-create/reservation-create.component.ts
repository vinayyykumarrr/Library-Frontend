
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../../../core/services/reservation.service';


@Component({
  selector: 'app-reservation-create',
  standalone: true,
  imports: [CommonModule, FormsModule],

  templateUrl: './reservation-create.component.html',
  styleUrls: ['./reservation-create.component.css']
})
export class ReservationCreateComponent {
  issue = ''; ret = ''; loading = false; private bookId: number;
  constructor(private route: ActivatedRoute, private svc: ReservationService, private router: Router){
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
  }
 submit(){
  if (!this.issue || !this.ret) { alert('Please select both dates'); return; }
  const start = new Date(this.issue);
  const end = new Date(this.ret);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) { alert('Invalid date format'); return; }
  if (start > end) { alert('Return date must be after issue date'); return; }

  const uid = Number(localStorage.getItem('uid'));
  if (!uid) { alert('Set your UID in the header first'); return; }

  this.loading = true;
  this.svc.createForBook(this.bookId, this.issue, this.ret).subscribe({
    next: _ => this.router.navigate(['/reservations']),
    error: (err) => {
      const msg = err?.error?.message || err?.error?.error || err?.statusText || 'Failed to reserve';
      alert(msg);
      this.loading = false;
    }
  });
}
}
