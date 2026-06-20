import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Todo, TodoStatus } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './todo-item.html',
})
export class TodoItemComponent {
  @Input({ required: true }) todo!: Todo;
  @Input() categoryName = '';
  @Input() categoryColor = '#6B7280';
  @Output() toggleStatus = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  get priorityClasses(): string {
    switch (this.todo.priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
    }
  }

  get statusClasses(): string {
    switch (this.todo.status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-gray-100 text-gray-700';
    }
  }

  get statusLabel(): string {
    switch (this.todo.status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'pending': return 'Pending';
    }
  }

  get isOverdue(): boolean {
    if (this.todo.status === 'completed') return false;
    return new Date(this.todo.dueDate) < new Date();
  }
}
