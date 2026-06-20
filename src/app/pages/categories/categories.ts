import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CategoryService } from '../../services/category.service';
import { TodoService } from '../../services/todo.service';
import { CategoryManagerComponent } from '../../components/category-manager/category-manager';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [CommonModule, CategoryManagerComponent],
  templateUrl: './categories.html',
})
export class CategoriesPage implements OnInit, OnDestroy {
  categories: Category[] = [];
  categoryTodoCounts: Record<string, number> = {};
  private sub = new Subscription();

  constructor(
    private categoryService: CategoryService,
    private todoService: TodoService,
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.categoryService.getCategories().subscribe((cats) => (this.categories = cats)),
    );
    this.sub.add(
      this.todoService.getTodos().subscribe((todos) => {
        const counts: Record<string, number> = {};
        todos.forEach((t) => {
          counts[t.categoryId] = (counts[t.categoryId] || 0) + 1;
        });
        this.categoryTodoCounts = counts;
      }),
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onAdd(event: { name: string; color: string }): void {
    this.categoryService.addCategory(event.name, event.color);
  }

  onUpdate(event: { id: string; name: string; color: string }): void {
    this.categoryService.updateCategory(event.id, { name: event.name, color: event.color });
  }

  onDelete(id: string): void {
    const count = this.categoryTodoCounts[id] || 0;
    const msg = count > 0
      ? `This category has ${count} todo(s). Delete anyway?`
      : 'Delete this category?';
    if (confirm(msg)) {
      this.categoryService.deleteCategory(id);
    }
  }
}
