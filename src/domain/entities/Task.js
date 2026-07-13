export class Task {
  constructor({ id, title, completed = false }) {
    this.id = id;
    this.title = title;
    this.completed = completed;
  }

  toggleComplete() {
    this.completed = !this.completed;
    return this;
  }

  updateTitle(newTitle) {
    if (!newTitle || !newTitle.trim()) {
      throw new Error('Task title cannot be empty');
    }
    this.title = newTitle.trim();
    return this;
  }

  static create({ id, title, completed = false }) {
    if (!title || !title.trim()) {
      throw new Error('Task title is required');
    }
    return new Task({ id, title: title.trim(), completed });
  }
}