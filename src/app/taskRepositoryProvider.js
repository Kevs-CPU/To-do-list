import { InMemoryTaskRepository } from "../data/repositories/InMemoryTaskRepository";
import { LocalStorageTaskRepository } from "../data/repositories/LocalStorageTaskRepository";

const INIT_TASKS = [
  { id: "1", title: "Buy groceries" },
  { id: "2", title: "Read a book" },
  { id: "3", title: "Finish project report" },
  { id: "4", title: "Pay utility bills" },
];

const REPOSITORY_TYPE = "localStorage";

let repositoryInstance = null;

export function getTaskRepository() {
  if (repositoryInstance) return repositoryInstance;

  try {
    if (REPOSITORY_TYPE === "localStorage") {
      repositoryInstance = new LocalStorageTaskRepository();
    } else {
      repositoryInstance = new InMemoryTaskRepository(INIT_TASKS);
    }
  } catch (err) {
    console.error(err);
    repositoryInstance = new InMemoryTaskRepository(INIT_TASKS);
  }

  return repositoryInstance;
}