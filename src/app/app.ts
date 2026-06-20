import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AuthService } from './services/auth.service';
import { SidebarComponent } from './components/sidebar/sidebar';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  isAuthenticated = false;
  isLoginPage = false;
  sidebarCollapsed = false;
  currentUser: { email: string; name: string } | null = null;
  appName = environment.appName;
  showUserMenu = false;

  private sub = new Subscription();

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.auth.isAuthenticated().subscribe((v) => (this.isAuthenticated = v)),
    );
    this.sub.add(
      this.auth.getCurrentUser().subscribe((u) => (this.currentUser = u)),
    );
    this.sub.add(
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe((e) => {
          this.isLoginPage = e.urlAfterRedirects === '/login';
          this.showUserMenu = false;
        }),
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
