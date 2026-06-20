import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo, TodoPriority, TodoStatus } from '../../models/todo.model';
import { Category } from '../../models/category.model';

export interface TodoFormData {
  title: string;
  description: string;
  priority: TodoPriority;
  status: TodoStatus;
  dueDate: string;
  categoryId: string;
}

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-form.html',
})
export class TodoFormComponent implements OnInit {
  @Input() categories: Category[] = [];
  @Input() initialData: Todo | null = null;
  @Input() submitLabel = 'Create Todo';

  @Output() formSubmit = new EventEmitter<TodoFormData>();
  @Output() formCancel = new EventEmitter<void>();

  formData: TodoFormData = {
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    categoryId: '',
  };

  ngOnInit(): void {
    if (this.initialData) {
      this.formData = {
        title: this.initialData.title,
        description: this.initialData.description,
        priority: this.initialData.priority,
        status: this.initialData.status,
        dueDate: this.initialData.dueDate,
        categoryId: this.initialData.categoryId,
      };
    }
  }

  onSubmit(): void {
    if (!this.formData.title.trim() || !this.formData.dueDate) return;
    this.formSubmit.emit({ ...this.formData });
  }
}
