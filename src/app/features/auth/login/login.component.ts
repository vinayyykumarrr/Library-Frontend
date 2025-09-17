import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.loading = true;
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res: HttpResponse<any>) => {
        if (!this.auth.storeTokenFromResponse(res)) {
          console.warn('Login succeeded but server returned no token. Response was:', res);
          alert('Login succeeded but server did not return a token');
          this.loading = false;
          return;
        }
        this.router.navigate(['/books']);
      },
      error: (err) => {
        console.error('Login error', err);
        // Try to surface a useful message if backend sends plain text or JSON
        const msg =
          typeof err?.error === 'string' ? err.error :
          err?.error?.message || err?.error?.error || err?.statusText || 'Bad Request';
        alert(msg);
        this.loading = false;
      }
    });
  }
}
