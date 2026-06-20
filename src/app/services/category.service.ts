import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from '../models/category.model';
import { StorageService } from './storage.service';
import { AnalyticsService } from './analytics.service';

const STORAGE_KEY = 'todo_categories';

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Work', color: '#3B82F6', createdAt: new Date().toISOString() },
  { id: 'cat-2', name: 'Personal', color: '#10B981', createdAt: new Date().toISOString() },
  { id: 'cat-3', name: 'Shopping', color: '#F59E0B', createdAt: new Date().toISOString() },
  { id: 'cat-4', name: 'Health', color: '#EF4444', createdAt: new Date().toISOString() },
];

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private categories$: BehaviorSubject<Category[]>;

  constructor(
    private storage: StorageService,
    private analytics: AnalyticsService,
  ) {
    this.categories$ = new BehaviorSubject<Category[]>(this.loadCategories());
  }

  private loadCategories(): Category[] {
    return this.storage.get<Category[]>(STORAGE_KEY) ?? [...DEFAULT_CATEGORIES];
  }

  private save(categories: Category[]): void {
    this.storage.set(STORAGE_KEY, categories);
    this.categories$.next(categories);
  }

  getCategories(): Observable<Category[]> {
    return this.categories$.asObservable();
  }

  getCategoryById(id: string): Observable<Category | undefined> {
    return this.categories$.pipe(map((cats) => cats.find((c) => c.id === id)));
  }

  addCategory(name: string, color: string): Category {
    const category: Category = {
      id: `cat-${Date.now()}`,
      name,
      color,
      createdAt: new Date().toISOString(),
    };
    const current = this.categories$.value;
    this.save([...current, category]);
    this.analytics.logEvent('create', 'Category', name);
    return category;
  }

  updateCategory(id: string, updates: Partial<Pick<Category, 'name' | 'color'>>): void {
    const current = this.categories$.value.map((c) =>
      c.id === id ? { ...c, ...updates } : c,
    );
    this.save(current);
    this.analytics.logEvent('update', 'Category', id);
  }

  deleteCategory(id: string): void {
    const current = this.categories$.value.filter((c) => c.id !== id);
    this.save(current);
    this.analytics.logEvent('delete', 'Category', id);
  }
}
