export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface ITaskRepository {
  getAll(): Promise<Task[]>;
  getById(id: string): Promise<Task | null>;
  add(task: Omit<Task, 'id'>): Promise<Task>;
  update(task: Task): Promise<Task>;
  remove(id: string): Promise<string>;
}

export default ITaskRepository;