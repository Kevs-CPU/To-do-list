import { TaskRepository } from '../repositories/TaskRepository';

export class RemoveTaskUseCase {
  private taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(id: string) {
    if (!id) throw new Error('Task ID is required');
    return await this.taskRepository.remove(id);
  }
}