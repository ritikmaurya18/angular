import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, combineLatest } from 'rxjs';
import { TodoService, TodoFilter } from '../../services/todo.service';
import { CategoryService } from '../../services/category.service';
import { TodoItemComponent } from '../../components/todo-item/todo-item';
import { TodoFilterComponent } from '../../components/todo-filter/todo-filter';
import { TodoFormComponent, TodoFormData } from '../../components/todo-form/todo-form';
import { Todo } from '../../models/todo.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TodoItemComponent, TodoFilterComponent, TodoFormComponent],
  templateUrl: './todo-list.html',
})
export class TodoListPage implements OnInit, OnDestroy {
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  categories: Category[] = [];
  showAddForm = false;
  isAtLimit = false;

  // Pagination
  pageSize = 10;
  currentPage = 1;
  totalPages = 1;
  paginatedTodos: Todo[] = [];

  // Sorting
  sortBy: 'createdAt' | 'dueDate' | 'priority' | 'title' = 'createdAt';
  sortDir: 'asc' | 'desc' = 'desc';

  private currentFilter: TodoFilter = {};
  private sub = new Subscription();

  constructor(
    private todoService: TodoService,
    private categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    this.sub.add(
      combineLatest([
        this.todoService.getTodos(),
        this.categoryService.getCategories(),
      ]).subscribe(([todos, categories]) => {
        this.categories = categories;
        this.applyFilterAndSort(todos);
      }),
    );

    this.sub.add(
      this.todoService.isAtLimit().subscribe((v) => (this.isAtLimit = v)),
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private applyFilterAndSort(todos: Todo[]): void {
    let result = [...todos];

    // Apply filter
    const f = this.currentFilter;
    if (f.status && f.status !== 'all') result = result.filter((t) => t.status === f.status);
    if (f.priority && f.priority !== 'all') result = result.filter((t) => t.priority === f.priority);
    if (f.categoryId && f.categoryId !== 'all') result = result.filter((t) => t.categoryId === f.categoryId);
    if (f.search) {
      const q = f.search.toLowerCase();
      result = result.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
      );
    }

    // Apply sort
    const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
    result.sort((a, b) => {
      let cmp = 0;
      switch (this.sortBy) {
        case 'createdAt':
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'dueDate':
          cmp = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'priority':
          cmp = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'title':
          cmp = a.title.localeCompare(b.title);
          break;
      }
      return this.sortDir === 'asc' ? cmp : -cmp;
    });

    this.filteredTodos = result;
    this.totalPages = Math.max(1, Math.ceil(result.length / this.pageSize));
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    this.updatePagination();
  }

  private updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedTodos = this.filteredTodos.slice(start, start + this.pageSize);
  }

  onFilterChange(filter: TodoFilter): void {
    this.currentFilter = filter;
    this.currentPage = 1;
    this.todoService.getTodos().subscribe((todos) => this.applyFilterAndSort(todos));
  }

  onSortChange(sortBy: string): void {
    if (this.sortBy === sortBy) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortBy as typeof this.sortBy;
      this.sortDir = 'desc';
    }
    this.todoService.getTodos().subscribe((todos) => this.applyFilterAndSort(todos));
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
  }

  onToggleStatus(id: string): void {
    this.todoService.toggleStatus(id);
  }

  onDelete(id: string): void {
    if (confirm('Delete this todo?')) {
      this.todoService.deleteTodo(id);
    }
  }

  onBulkDeleteCompleted(): void {
    if (confirm('Delete all completed todos?')) {
      this.todoService.bulkDeleteCompleted();
    }
  }

  onAddTodo(data: TodoFormData): void {
    const result = this.todoService.addTodo(data);
    if (result) {
      this.showAddForm = false;
    }
  }

  getCategoryName(id: string): string {
    return this.categories.find((c) => c.id === id)?.name ?? '';
  }

  getCategoryColor(id: string): string {
    return this.categories.find((c) => c.id === id)?.color ?? '#6B7280';
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
