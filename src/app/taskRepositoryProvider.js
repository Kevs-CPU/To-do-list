import { InMemoryTaskRepository } from "../data/repositories/InMemoryTaskRepository";
import { LocalStorageTaskRepository } from "../data/repositories/LocalStorageTaskRepository";

const REPOSITORY_TYPE = "localStorage";

let repositoryInstance = null;

export function getTaskRepository() {
  if (repositoryInstance) return repositoryInstance;

  try {
    if (REPOSITORY_TYPE === "localStorage") {
      repositoryInstance = new LocalStorageTaskRepository();
    } else {
      repositoryInstance = new InMemoryTaskRepository();
    }
  } catch (err) {
    console.error(err);
    repositoryInstance = new InMemoryTaskRepository();
  }

  return repositoryInstance;
}