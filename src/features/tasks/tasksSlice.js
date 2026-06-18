import { createSlice, nanoid } from "@reduxjs/toolkit";

const STORAGE_KEY = "todo_ml_v3";

const INIT_TASKS = [
  { id: 1, text: "Buy groceries",         list: "shopping", done: false },
  { id: 2, text: "Read a book",           list: "personal", done: false },
  { id: 3, text: "Finish project report", list: "work",      done: true  },
  { id: 4, text: "Pay utility bills",     list: "default",  done: false },
];

function loadInitialTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ?? INIT_TASKS;
  } catch {
    return INIT_TASKS;
  }
}

const tasksSlice = createSlice({
  name: "tasks",
  initialState: loadInitialTasks(),
  reducers: {
    taskAdded: {
      reducer(state, action) {
        state.push(action.payload);
      },
      prepare(text, list) {
        return { payload: { id: nanoid(), text, list, done: false } };
      },
    },
    taskToggled(state, action) {
      const task = state.find((t) => t.id === action.payload);
      if (task) task.done = !task.done;
    },
    taskDeleted(state, action) {
      return state.filter((t) => t.id !== action.payload);
    },
    taskEdited(state, action) {
      const { id, text } = action.payload;
      const task = state.find((t) => t.id === id);
      if (task) task.text = text;
    },
  },
});

export const { taskAdded, taskToggled, taskDeleted, taskEdited } = tasksSlice.actions;
export default tasksSlice.reducer;