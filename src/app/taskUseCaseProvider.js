// app/taskUseCaseProvider.js
import { InMemoryTaskRepository } from "./repositories/InMemoryTaskRepository";
import { LocalStorageTaskRepository } from "./repositories/LocalStorageTaskRepository";

import { AddTaskUseCase } from "./usecases/add_task_usecase";
import { RemoveTaskUseCase } from "./usecases/remove_task_usecase";
import { UpdateTaskUseCase } from "./usecases/update_task_usecase";
import { GetAllTasksUseCase } from "./usecases/get_all_tasks_usecase";

const REPOSITORY_TYPE = "localStorage";

let repositoryInstance = null;

function getTaskRepository() {
  if (repositoryInstance) return repositoryInstance;

  try {
    if (REPOSITORY_TYPE === "localStorage") {
      repositoryInstance = new LocalStorageTaskRepository();
    } else {
      repositoryInstance = new InMemoryTaskRepository();
    }
  } catch (err) {
    console.error("Failed to initialize repository:", err);
    repositoryInstance = new InMemoryTaskRepository();
  }

  return repositoryInstance;
}

const repo = getTaskRepository();

export const addTaskUseCase = new AddTaskUseCase(repo);
export const removeTaskUseCase = new RemoveTaskUseCase(repo);
export const updateTaskUseCase = new UpdateTaskUseCase(repo);
export const getAllTasksUseCase = new GetAllTasksUseCase(repo);