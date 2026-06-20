import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoFilter } from '../../services/todo.service';
import { Category } from '../../models/category.model';
import { TodoPriority, TodoStatus } from '../../models/todo.model';

@Component({
  selector: 'app-todo-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-filter.html',
})
export class TodoFilterComponent {
  @Input() categories: Category[] = [];

  @Output() filterChange = new EventEmitter<TodoFilter>();

  search = '';
  status: TodoStatus | 'all' = 'all';
  priority: TodoPriority | 'all' = 'all';
  categoryId: string | 'all' = 'all';

  onFilterChange(): void {
    this.filterChange.emit({
      search: this.search || undefined,
      status: this.status,
      priority: this.priority,
      categoryId: this.categoryId,
    });
  }

  clearFilters(): void {
    this.search = '';
    this.status = 'all';
    this.priority = 'all';
    this.categoryId = 'all';
    this.onFilterChange();
  }
}
