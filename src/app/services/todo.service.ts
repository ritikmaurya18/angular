import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Todo, TodoPriority, TodoStatus } from '../models/todo.model';
import { StorageService } from './storage.service';
import { AnalyticsService } from './analytics.service';
import { environment } from '../../environments/environment';

const STORAGE_KEY = 'todo_app_data';

const SAMPLE_TODOS: Todo[] = [
  {
    id: 'todo-1',
    title: 'Set up project documentation',
    description: 'Create README and setup guides for the new project.',
    priority: 'high',
    status: 'completed',
    dueDate: '2026-06-25',
    categoryId: 'cat-1',
    createdAt: '2026-06-15T10:00:00Z',
    updatedAt: '2026-06-18T14:00:00Z',
  },
  {
    id: 'todo-2',
    title: 'Buy groceries',
    description: 'Milk, eggs, bread, fruits, and vegetables.',
    priority: 'medium',
    status: 'pending',
    dueDate: '2026-06-22',
    categoryId: 'cat-3',
    createdAt: '2026-06-18T08:00:00Z',
    updatedAt: '2026-06-18T08:00:00Z',
  },
  {
    id: 'todo-3',
    title: 'Morning jog',
    description: 'Run 5km in the park before work.',
    priority: 'low',
    status: 'in-progress',
    dueDate: '2026-06-21',
    categoryId: 'cat-4',
    createdAt: '2026-06-19T06:00:00Z',
    updatedAt: '2026-06-19T06:00:00Z',
  },
  {
    id: 'todo-4',
    title: 'Review pull requests',
    description: 'Go through open PRs on the team repository.',
    priority: 'high',
    status: 'pending',
    dueDate: '2026-06-20',
    categoryId: 'cat-1',
    createdAt: '2026-06-19T09:00:00Z',
    updatedAt: '2026-06-19T09:00:00Z',
  },
  {
    id: 'todo-5',
    title: 'Plan weekend trip',
    description: 'Research destinations and book accommodation.',
    priority: 'medium',
    status: 'pending',
    dueDate: '2026-06-28',
    categoryId: 'cat-2',
    createdAt: '2026-06-20T07:00:00Z',
    updatedAt: '2026-06-20T07:00:00Z',
  },
];

export interface TodoFilter {
  status?: TodoStatus | 'all';
  priority?: TodoPriority | 'all';
  categoryId?: string | 'all';
  search?: string;
}

@Injectable({ providedIn: 'root' })
export class TodoService {
  private todos$: BehaviorSubject<Todo[]>;

  constructor(
    private storage: StorageService,
    private analytics: AnalyticsService,
  ) {
    this.todos$ = new BehaviorSubject<Todo[]>(this.loadTodos());
  }

  private loadTodos(): Todo[] {
    return this.storage.get<Todo[]>(STORAGE_KEY) ?? [...SAMPLE_TODOS];
  }

  private save(todos: Todo[]): void {
    this.storage.set(STORAGE_KEY, todos);
    this.todos$.next(todos);
  }

  getTodos(): Observable<Todo[]> {
    return this.todos$.asObservable();
  }

  getTodoById(id: string): Observable<Todo | undefined> {
    return this.todos$.pipe(map((todos) => todos.find((t) => t.id === id)));
  }

  getFilteredTodos(filter: TodoFilter): Observable<Todo[]> {
    return this.todos$.pipe(
      map((todos) =>
        todos.filter((t) => {
          if (filter.status && filter.status !== 'all' && t.status !== filter.status) return false;
          if (filter.priority && filter.priority !== 'all' && t.priority !== filter.priority) return false;
          if (filter.categoryId && filter.categoryId !== 'all' && t.categoryId !== filter.categoryId) return false;
          if (filter.search) {
            const q = filter.search.toLowerCase();
            if (!t.title.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) return false;
          }
          return true;
        }),
      ),
    );
  }

  addTodo(todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Todo | null {
    const current = this.todos$.value;
    if (current.length >= environment.maxTodoItems) {
      return null;
    }
    const newTodo: Todo = {
      ...todo,
      id: `todo-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.save([...current, newTodo]);
    this.analytics.logEvent('create', 'Todo', newTodo.title);
    return newTodo;
  }

  updateTodo(id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): void {
    const current = this.todos$.value.map((t) =>
      t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t,
    );
    this.save(current);
    this.analytics.logEvent('update', 'Todo', id);
  }

  deleteTodo(id: string): void {
    const current = this.todos$.value.filter((t) => t.id !== id);
    this.save(current);
    this.analytics.logEvent('delete', 'Todo', id);
  }

  toggleStatus(id: string): void {
    const todo = this.todos$.value.find((t) => t.id === id);
    if (!todo) return;
    const statusOrder: TodoStatus[] = ['pending', 'in-progress', 'completed'];
    const nextIndex = (statusOrder.indexOf(todo.status) + 1) % statusOrder.length;
    this.updateTodo(id, { status: statusOrder[nextIndex] });
  }

  bulkDeleteCompleted(): void {
    const current = this.todos$.value.filter((t) => t.status !== 'completed');
    this.save(current);
    this.analytics.logEvent('bulk_delete_completed', 'Todo');
  }

  resetData(): void {
    this.save([...SAMPLE_TODOS]);
  }

  getTodoCount(): Observable<number> {
    return this.todos$.pipe(map((t) => t.length));
  }

  getMaxLimit(): number {
    return environment.maxTodoItems;
  }

  isAtLimit(): Observable<boolean> {
    return this.todos$.pipe(map((t) => t.length >= environment.maxTodoItems));
  }
}
