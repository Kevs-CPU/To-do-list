import { nanoid } from "@reduxjs/toolkit";
import { ITaskRepository } from "../../domain/repositories/ITaskRepository";
import { Task } from "../../domain/entities/Task";

export class InMemoryTaskRepository extends ITaskRepository {
  constructor(initialTasks = []) {
    super();
    this.tasks = initialTasks.map((t) => {
      const task = new Task(t);
      task.list = t.list || "default";
      task.done = t.done || false;
      return task;
    });
  }

  addTask({ title, list }) {
    const task = new Task({ id: nanoid(), title });
    task.list = list || "default";
    task.done = false;
    this.tasks.push(task);
    return task;
  }

  removeTask(id) {
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }

  updateTask(id, changes) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return null;
    Object.assign(task, changes);
    return task;
  }

  getAllTasks() {
    return [...this.tasks];
  }

  getTask(id) {
    return this.tasks.find((t) => t.id === id) ?? null;
  }
}