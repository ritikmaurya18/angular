import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription, combineLatest } from 'rxjs';
import { TodoService, TodoFilter } from '../../services/todo.service';
import { CategoryService } from '../../services/category.service';
import { StatsCardComponent } from '../../components/stats-card/stats-card';
import { TodoItemComponent } from '../../components/todo-item/todo-item';
import { TodoFormComponent, TodoFormData } from '../../components/todo-form/todo-form';
import { Todo } from '../../models/todo.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, StatsCardComponent, TodoItemComponent, TodoFormComponent],
  templateUrl: './dashboard.html',
})
export class DashboardPage implements OnInit, OnDestroy {
  todos: Todo[] = [];
  categories: Category[] = [];
  recentTodos: Todo[] = [];
  showQuickAdd = false;

  totalCount = 0;
  pendingCount = 0;
  inProgressCount = 0;
  completedCount = 0;
  overdueCount = 0;
  isAtLimit = false;
  maxLimit = 0;

  private sub = new Subscription();

  constructor(
    private todoService: TodoService,
    private categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    this.maxLimit = this.todoService.getMaxLimit();

    this.sub.add(
      combineLatest([
        this.todoService.getTodos(),
        this.categoryService.getCategories(),
      ]).subscribe(([todos, categories]) => {
        this.todos = todos;
        this.categories = categories;
        this.computeStats();
        this.recentTodos = [...todos]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
      }),
    );

    this.sub.add(
      this.todoService.isAtLimit().subscribe((v) => (this.isAtLimit = v)),
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private computeStats(): void {
    this.totalCount = this.todos.length;
    this.pendingCount = this.todos.filter((t) => t.status === 'pending').length;
    this.inProgressCount = this.todos.filter((t) => t.status === 'in-progress').length;
    this.completedCount = this.todos.filter((t) => t.status === 'completed').length;
    this.overdueCount = this.todos.filter(
      (t) => t.status !== 'completed' && new Date(t.dueDate) < new Date(),
    ).length;
  }

  getCategoryName(id: string): string {
    return this.categories.find((c) => c.id === id)?.name ?? '';
  }

  getCategoryColor(id: string): string {
    return this.categories.find((c) => c.id === id)?.color ?? '#6B7280';
  }

  onToggleStatus(id: string): void {
    this.todoService.toggleStatus(id);
  }

  onDelete(id: string): void {
    if (confirm('Delete this todo?')) {
      this.todoService.deleteTodo(id);
    }
  }

  onQuickAdd(data: TodoFormData): void {
    const result = this.todoService.addTodo(data);
    if (result) {
      this.showQuickAdd = false;
    }
  }
}
