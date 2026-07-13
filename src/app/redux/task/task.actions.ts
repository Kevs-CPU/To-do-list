// Action Types
export const ADD_TASK = "ADD_TASK";
export const REMOVE_TASK = "REMOVE_TASK";
export const UPDATE_TASK = "UPDATE_TASK";
export const GET_ALL_TASKS = "GET_ALL_TASKS";

// Action Creators
export const addTask = (title: string) => ({
  type: ADD_TASK,
  payload: { title }  // Wrap in object
});

export const removeTask = (id: string) => ({
  type: REMOVE_TASK,
  payload: id
});

export const updateTask = (id: string, updates: { title?: string; completed?: boolean }) => ({
  type: UPDATE_TASK,
  payload: { id, ...updates }
});

export const getAllTasks = (tasks: any[]) => ({
  type: GET_ALL_TASKS,
  payload: tasks
});