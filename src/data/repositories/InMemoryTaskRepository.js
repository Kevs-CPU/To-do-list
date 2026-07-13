let tasks = [];
let nextId = 1;

export class InMemoryTaskRepository {
  async getAll() {
    return [...tasks];
  }

  async getById(id) {
    return tasks.find(task => task.id === id) || null;
  }

  async add(task) {
    const newTask = {
      ...task,
      id: String(nextId++)
    };
    tasks.push(newTask);
    return newTask;
  }

  async update(task) {
    const index = tasks.findIndex(t => t.id === task.id);
    if (index === -1) throw new Error('Task not found');
    tasks[index] = task;
    return task;
  }

  async remove(id) {
    const filtered = tasks.filter(t => t.id !== id);
    if (filtered.length === tasks.length) throw new Error('Task not found');
    tasks = filtered;
    return id;
  }

  clear() {
    tasks = [];
    nextId = 1;
  }
}