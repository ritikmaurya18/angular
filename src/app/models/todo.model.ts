export type TodoStatus = 'pending' | 'in-progress' | 'completed';
export type TodoPriority = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;
  title: string;
  description: string;
  priority: TodoPriority;
  status: TodoStatus;
  dueDate: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}
