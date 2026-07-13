import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LocalStorageTaskRepository } from '../../../data/repositories/LocalStorageTaskRepository';
import { GetAllTasksUseCase } from '../../../domain/usecases/get_all_tasks_usecase';
import { AddTaskUseCase } from '../../../domain/usecases/add_task_usecase';
import { UpdateTaskUseCase } from '../../../domain/usecases/update_task_usecase';
import { RemoveTaskUseCase } from '../../../domain/usecases/remove_task_usecase';

// Types
interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: 'all' | 'active' | 'completed';
}

// Initialize repository
const taskRepository = new LocalStorageTaskRepository();

// Async thunks
export const fetchTasks = createAsyncThunk<Task[], void>(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const useCase = new GetAllTasksUseCase(taskRepository);
      const result = await useCase.execute();
      return result as Task[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch tasks');
    }
  }
);

export const addTask = createAsyncThunk<Task, { title: string }>(
  'tasks/addTask',
  async ({ title }, { rejectWithValue }) => {
    try {
      const useCase = new AddTaskUseCase(taskRepository);
      const result = await useCase.execute(title);
      return result as Task;
    } catch (error: any) {
      // Error message from use case (e.g., "Please enter a valid Gmail address")
      return rejectWithValue(error.message || 'Failed to add task');
    }
  }
);

export const updateTask = createAsyncThunk<Task, { id: string; title?: string; completed?: boolean }>(
  'tasks/updateTask',
  async ({ id, title, completed }, { rejectWithValue }) => {
    try {
      const useCase = new UpdateTaskUseCase(taskRepository);
      const result = await useCase.execute({ id, title, completed });
      return result as Task;
    } catch (error: any) {
      // Error message from use case (e.g., "Please enter a valid Gmail address")
      return rejectWithValue(error.message || 'Failed to update task');
    }
  }
);

export const removeTask = createAsyncThunk<string, string>(
  'tasks/removeTask',
  async (id, { rejectWithValue }) => {
    try {
      const useCase = new RemoveTaskUseCase(taskRepository);
      const result = await useCase.execute(id);
      return result as string;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove task');
    }
  }
);

// Initial state
const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  filter: 'all',
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilter: (state, action: PayloadAction<'all' | 'active' | 'completed'>) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload || [];
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch tasks';
      })
      .addCase(addTask.fulfilled, (state, action) => {
        if (action.payload) {
          state.tasks.push(action.payload);
          state.error = null; // Clear error on success
        }
      })
      .addCase(addTask.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to add task';
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.tasks.findIndex(t => t.id === action.payload.id);
          if (index !== -1) {
            state.tasks[index] = action.payload;
          }
          state.error = null; // Clear error on success
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to update task';
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        if (action.payload) {
          state.tasks = state.tasks.filter(t => t.id !== action.payload);
          state.error = null; // Clear error on success
        }
      })
      .addCase(removeTask.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to remove task';
      });
  },
});

export const { clearError, setFilter } = taskSlice.actions;
export default taskSlice.reducer;