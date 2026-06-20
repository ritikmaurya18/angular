import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { TodoService } from '../../services/todo.service';
import { CategoryService } from '../../services/category.service';
import { TodoFormComponent, TodoFormData } from '../../components/todo-form/todo-form';
import { Todo } from '../../models/todo.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-todo-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TodoFormComponent],
  templateUrl: './todo-detail.html',
})
export class TodoDetailPage implements OnInit, OnDestroy {
  todo: Todo | null = null;
  categories: Category[] = [];
  editing = false;
  notFound = false;

  private sub = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService,
    private categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.categoryService.getCategories().subscribe((cats) => (this.categories = cats)),
    );

    this.sub.add(
      this.route.paramMap.subscribe((params) => {
        const id = params.get('id');
        if (!id) {
          this.notFound = true;
          return;
        }
        this.sub.add(
          this.todoService.getTodoById(id).subscribe((todo) => {
            this.todo = todo ?? null;
            this.notFound = !todo;
          }),
        );
      }),
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getCategoryName(id: string): string {
    return this.categories.find((c) => c.id === id)?.name ?? 'None';
  }

  getCategoryColor(id: string): string {
    return this.categories.find((c) => c.id === id)?.color ?? '#6B7280';
  }

  get priorityClasses(): string {
    switch (this.todo?.priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return '';
    }
  }

  get statusClasses(): string {
    switch (this.todo?.status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-gray-100 text-gray-700';
      default: return '';
    }
  }

  toggleStatus(): void {
    if (this.todo) this.todoService.toggleStatus(this.todo.id);
  }

  onDelete(): void {
    if (this.todo && confirm('Delete this todo?')) {
      this.todoService.deleteTodo(this.todo.id);
      this.router.navigate(['/todos']);
    }
  }

  onEdit(data: TodoFormData): void {
    if (this.todo) {
      this.todoService.updateTodo(this.todo.id, data);
      this.editing = false;
    }
  }
}
