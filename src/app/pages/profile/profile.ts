import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TodoService } from '../../services/todo.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
})
export class ProfilePage implements OnInit {
  user = { email: '', name: '' };
  todoCount = 0;
  appName = environment.appName;
  appVersion = environment.appVersion;
  apiBaseUrl = environment.apiBaseUrl;
  analyticsEnabled = environment.enableAnalytics;
  maxTodos = environment.maxTodoItems;
  envFileVars = [
    { key: 'NG_APP_API_URL', value: import.meta.env?.['NG_APP_API_URL'] ?? 'N/A (build-time)' },
    { key: 'NG_APP_APP_NAME', value: import.meta.env?.['NG_APP_APP_NAME'] ?? 'N/A (build-time)' },
    { key: 'NG_APP_VERSION', value: import.meta.env?.['NG_APP_VERSION'] ?? 'N/A (build-time)' },
    { key: 'NG_APP_ANALYTICS', value: import.meta.env?.['NG_APP_ANALYTICS'] ?? 'N/A (build-time)' },
    { key: 'NG_APP_MAX_TODOS', value: import.meta.env?.['NG_APP_MAX_TODOS'] ?? 'N/A (build-time)' },
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
    private todoService: TodoService,
  ) {}

  ngOnInit(): void {
    const u = this.auth.getCurrentUserSnapshot();
    if (u) {
      this.user = { email: u.email, name: u.name };
    }
    this.todoService.getTodoCount().subscribe((c) => (this.todoCount = c));
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  resetData(): void {
    if (confirm('Reset all data to defaults? This will clear your todos and categories.')) {
      this.todoService.resetData();
      localStorage.removeItem('todo_categories');
      window.location.reload();
    }
  }
}
