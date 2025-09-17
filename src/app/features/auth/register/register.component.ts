import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  loading = false;
  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.loading = true;
    this.auth.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        // auto-login if backend returns token; otherwise send to /login
        if (this.auth.storeTokenFromResponse(res)) {
          this.router.navigate(['/books']);
          return;
        }
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration error', err);
        const msg = err?.error?.message || err?.error?.error || err?.statusText || 'Registration failed';
        alert(msg);
        this.loading = false;
      }
    });
  }
}
