import { ITaskRepository } from '../repositories/ITaskRepository';

export class UpdateTaskUseCase {
  private taskRepository: ITaskRepository;

  constructor(taskRepository: ITaskRepository) {
    this.taskRepository = taskRepository;
  }

  private validateGmail(email: string): boolean {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  }

  async execute({ id, title, completed }: { id: string; title?: string; completed?: boolean }) {
    if (!id) throw new Error('Task ID is required');
    
    if (title !== undefined) {
      if (!title.trim()) {
        throw new Error('Email address is required');
      }
      if (!this.validateGmail(title.trim())) {
        throw new Error('Please enter a valid Gmail address (e.g., name@gmail.com)');
      }
    }

    const task = await this.taskRepository.getById(id);
    if (!task) throw new Error('Task not found');

    if (title !== undefined) {
      task.title = title.trim();
    }

    if (completed !== undefined) {
      task.completed = completed;
    }

    return await this.taskRepository.update(task);
  }
}