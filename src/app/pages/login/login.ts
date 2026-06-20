import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
})
export class LoginPage {
  email = '';
  password = '';
  error = '';
  loading = false;
  appName = environment.appName;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  onLogin(): void {
    this.error = '';
    this.loading = true;

    setTimeout(() => {
      const success = this.auth.login(this.email, this.password);
      this.loading = false;

      if (success) {
        this.router.navigate(['/']);
      } else {
        this.error = 'Invalid email or password. Try admin@example.com / password123';
      }
    }, 500);
  }
}
