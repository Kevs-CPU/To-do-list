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

  private extractGmailFromTitle(title: string): string {
    const parts = title.split('-');
    return parts[0].trim();
  }

  private extractTaskDescription(title: string): string {
    const parts = title.split('-');
    return parts.slice(1).join('-').trim();
  }

  async execute({ id, title, completed }: { id: string; title?: string; completed?: boolean }) {
    if (!id) {
      throw new Error('Task ID is required');
    }

    const task = await this.taskRepository.getById(id);
    if (!task) {
      throw new Error('Task not found');
    }

    if (title !== undefined) {
      const trimmedTitle = title.trim();
      
      if (!trimmedTitle) {
        throw new Error('Email address is required');
      }

      const gmail = this.extractGmailFromTitle(trimmedTitle);
      const taskDescription = this.extractTaskDescription(trimmedTitle);

      if (!this.validateGmail(gmail)) {
        throw new Error('Please enter a valid Gmail address (e.g., name@gmail.com)');
      }

      if (!taskDescription) {
        throw new Error('Task description is required');
      }

      task.title = trimmedTitle;
    }

    if (completed !== undefined) {
      task.completed = completed;
    }

    return await this.taskRepository.update(task);
  }
}