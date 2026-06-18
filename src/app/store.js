import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../features/tasks/tasksSlice";

const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("todo_ml_v3");
    if (serializedState === null) return undefined;
    
    return {
      tasks: JSON.parse(serializedState)
    };
  } catch (e) {
    console.warn("Hindi ma-load ang data mula sa localStorage:", e);
    return undefined;
  }
};

const preloadedState = loadFromLocalStorage();

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  localStorage.setItem("todo_ml_v3", JSON.stringify(store.getState().tasks));
});