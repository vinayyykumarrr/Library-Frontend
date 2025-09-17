
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  uid = signal<number | null>(this.getStoredUid());
  constructor(private auth: AuthService, private router: Router) {}
  isLoggedIn = () => this.auth.isLoggedIn();
  isAdmin = () => this.auth.hasRole('ADMIN') || this.auth.hasRole('ROLE_ADMIN');
  saveUid(v: string){ const n = Number(v); if(!Number.isFinite(n)) return; localStorage.setItem('uid', String(n)); this.uid.set(n); }
  getStoredUid(){ const v = localStorage.getItem('uid'); return v ? Number(v) : null; }
  logout(){
  this.auth.logout();                 
  localStorage.removeItem('uid');     
  sessionStorage.removeItem('uid');
  this.uid.set(null);               
  this.router.navigate(['/login']);
}

}
