import { ITaskRepository as TaskRepository } from '../repositories/ITaskRepository';

export class GetAllTasksUseCase {
  private taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute() {
    return await this.taskRepository.getAll();
  }
}