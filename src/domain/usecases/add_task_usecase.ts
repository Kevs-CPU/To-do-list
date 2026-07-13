import { TaskRepository } from '../repositories/TaskRepository';

export class AddTaskUseCase {
  private taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  private validateGmail(email: string): boolean {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  }

  async execute(title: string) {
    if (!title || !title.trim()) {
      throw new Error('Email address is required');
    }

    if (!this.validateGmail(title.trim())) {
      throw new Error('Please enter a valid Gmail address (e.g., name@gmail.com)');
    }

    const task = {
      title: title.trim(),
      completed: false
    };

    return await this.taskRepository.add(task);
  }
}