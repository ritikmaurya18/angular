import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/', icon: '📊' },
    { label: 'Todos', route: '/todos', icon: '✅' },
    { label: 'Categories', route: '/categories', icon: '🏷️' },
    { label: 'Profile', route: '/profile', icon: '👤' },
  ];
}
