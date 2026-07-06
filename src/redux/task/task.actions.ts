import { ADD_TASK, REMOVE_TASK, UPDATE_TASK, GET_ALL_TASKS, GET_TASK } from './task.types';

interface Task {
  id: string;
  title: string;
}

export const addTask = (task: Task) => ({
  type: ADD_TASK,
  payload: task,
});

export const removeTask = (id: string) => ({
  type: REMOVE_TASK,
  payload: id,
});

export const updateTask = (id: string, changes: Partial<Task>) => ({
  type: UPDATE_TASK,
  payload: { id, changes },
});

export const getAllTasks = (tasks: Task[]) => ({
  type: GET_ALL_TASKS,
  payload: tasks,
});

export const getTask = (task: Task) => ({
  type: GET_TASK,
  payload: task,
});