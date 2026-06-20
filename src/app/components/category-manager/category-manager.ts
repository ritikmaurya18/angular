import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-manager.html',
})
export class CategoryManagerComponent {
  @Input() categories: Category[] = [];
  @Output() addCategory = new EventEmitter<{ name: string; color: string }>();
  @Output() updateCategory = new EventEmitter<{ id: string; name: string; color: string }>();
  @Output() deleteCategory = new EventEmitter<string>();

  newName = '';
  newColor = '#3B82F6';
  editingId: string | null = null;
  editName = '';
  editColor = '';

  onAdd(): void {
    if (!this.newName.trim()) return;
    this.addCategory.emit({ name: this.newName.trim(), color: this.newColor });
    this.newName = '';
    this.newColor = '#3B82F6';
  }

  startEdit(cat: Category): void {
    this.editingId = cat.id;
    this.editName = cat.name;
    this.editColor = cat.color;
  }

  saveEdit(): void {
    if (!this.editingId || !this.editName.trim()) return;
    this.updateCategory.emit({ id: this.editingId, name: this.editName.trim(), color: this.editColor });
    this.editingId = null;
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  onDelete(id: string): void {
    this.deleteCategory.emit(id);
  }
}
