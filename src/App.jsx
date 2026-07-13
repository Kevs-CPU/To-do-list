import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTasks,
  addTask,
  updateTask,
  removeTask,
  clearError,
  setFilter,
} from "./app/redux/task/task.slice";
import "./App.css";

export default function App() {
  const dispatch = useDispatch();
  
  const tasks = useSelector((state) => state.tasks.tasks || []);
  const loading = useSelector((state) => state.tasks.loading || false);
  const error = useSelector((state) => state.tasks.error);
  const filter = useSelector((state) => state.tasks.filter || 'all');
  const activeCount = useSelector((state) => {
    const tasks = state.tasks.tasks || [];
    return tasks.filter(task => !task.completed).length;
  });

  // Local UI State
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showAddBar, setShowAddBar] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    if (showAddBar && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showAddBar]);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  // UI Event Handlers
  const handleAddTask = () => {
    if (!input.trim()) return;
    dispatch(addTask({ title: input }));
    setInput("");
    setShowAddBar(false);
  };

  const handleDeleteTask = (id) => {
    if (editId === id) resetEdit();
    dispatch(removeTask(id));
  };

  const handleStartEdit = (todo) => {
    setEditId(todo.id);
    setEditText(todo.title);
  };

  const resetEdit = () => {
    setEditId(null);
    setEditText("");
    dispatch(clearError());
  };

  const handleSaveEdit = (id) => {
    if (!editText.trim()) {
      dispatch(clearError());
      return;
    }
    dispatch(updateTask({ id, title: editText }));
    resetEdit();
  };

  const handleToggleComplete = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      dispatch(updateTask({ 
        id, 
        completed: !task.completed  // Toggle!
      }));
    }
  };

  const handleFilterChange = (newFilter) => {
    dispatch(setFilter(newFilter));
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    dispatch(clearError());
  };

  const handleKeyDown = (e, action) => {
    if (e.key === "Enter") action();
    if (e.key === "Escape") setShowAddBar(false);
  };

  return (
    <div className="app-shell">
      {/* Header */}
      <header className="topbar">
        <div className="topbar-content">
          <div className="topbar-title">
            <span className="topbar-icon">📋</span>
            <div>
              <span className="topbar-heading">Task Manager</span>
              <span className="topbar-sub">Manage tasks with Gmail</span>
            </div>
          </div>
          <div className="topbar-stats">
            <span className="stat-badge">{activeCount} pending</span>
          </div>
        </div>
      </header>

      {/* Error Toast */}
      {error && (
        <div className="toast-error">
          <span className="toast-icon">⚠️</span>
          <span className="toast-message">{error}</span>
          <button 
            className="toast-close" 
            onClick={() => dispatch(clearError())} 
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {/* Add Bar Modal */}
      <div className={`add-bar-overlay ${showAddBar ? "active" : ""}`}>
        <div className="add-bar-modal">
          <div className="add-bar-header">
            <span className="add-bar-title">✏️ Add New Task</span>
            <button 
              className="add-bar-close" 
              onClick={() => setShowAddBar(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="add-bar-body">
            <div className="input-group">
              <span className="input-icon">📧</span>
              <input
                ref={inputRef}
                className={`add-input ${error ? "error" : ""}`}
                name="newTask"
                id="newTask"
                placeholder="Enter Gmail address (e.g., name@gmail.com)"
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, handleAddTask)}
              />
            </div>
            <div className="input-hint">
              <span>💡</span>
              <span>Only Gmail addresses are allowed (e.g., name@gmail.com)</span>
            </div>
            {error && (
              <div className="input-error">
                <span className="error-icon">❌</span>
                <span>{error}</span>
              </div>
            )}
            <div className="add-bar-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowAddBar(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleAddTask}
              >
                ➕ Add Task
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="filter-row">
        <div className="filter-group">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              className={`filter-chip ${filter === f ? "active" : ""}`}
              onClick={() => handleFilterChange(f)}
            >
              {f === "all" && "📋 All"}
              {f === "active" && "⏳ Active"}
              {f === "completed" && "✅ Completed"}
            </button>
          ))}
        </div>
        <span className="filter-count">
          <span className="count-number">{activeCount}</span>
          <span className="count-label">tasks remaining</span>
        </span>
      </div>

      {/* Task List */}
      <main className="task-scroll">
        {loading && (
          <div className="empty-state">
            <div className="loader"></div>
            <p>Loading your tasks...</p>
          </div>
        )}

        {!loading && filteredTasks.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <h3>No tasks found</h3>
            <p>Add your first Gmail task</p>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setShowAddBar(true)}
            >
              + Add your first task
            </button>
          </div>
        )}

        <ul className="task-list">
          {filteredTasks.map((todo) => (
            <li 
              key={todo.id} 
              className={`task-card ${todo.completed ? "completed" : ""}`}
            >
              <button
                type="button"
                className={`task-checkbox ${todo.completed ? "checked" : ""}`}
                onClick={() => handleToggleComplete(todo.id)}
                aria-label="Mark as complete"
              >
                {todo.completed && <span className="checkmark">✓</span>}
              </button>

              <div className="task-body">
                {editId === todo.id ? (
                  <div className="edit-container">
                    <div className="input-group inline">
                      <span className="input-icon">📧</span>
                      <input
                        className={`edit-input ${error ? "error" : ""}`}
                        name={`editTask-${todo.id}`}
                        id={`editTask-${todo.id}`}
                        placeholder="Enter Gmail address"
                        value={editText}
                        onChange={(e) => {
                          setEditText(e.target.value);
                          dispatch(clearError());
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit(todo.id);
                          if (e.key === "Escape") resetEdit();
                        }}
                        autoFocus
                      />
                    </div>
                    {error && (
                      <div className="input-error small">
                        <span className="error-icon">❌</span>
                        <span>{error}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="task-content">
                    <span className="task-email-icon">📧</span>
                    <div className="task-info">
                      <span className={`task-title ${todo.completed ? "completed" : ""}`}>
                        {todo.title}
                      </span>
                      <span className="task-meta">Gmail Task</span>
                    </div>
                    {todo.completed && (
                      <span className="task-badge">✅ Done</span>
                    )}
                  </div>
                )}
              </div>

              <div className="task-actions">
                {editId === todo.id ? (
                  <>
                    <button 
                      className="icon-btn save" 
                      onClick={() => handleSaveEdit(todo.id)} 
                      aria-label="Save"
                      title="Save"
                    >
                      ✓
                    </button>
                    <button 
                      className="icon-btn cancel" 
                      onClick={resetEdit} 
                      aria-label="Cancel"
                      title="Cancel"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className="icon-btn edit" 
                      onClick={() => handleStartEdit(todo)} 
                      aria-label="Edit"
                      title="Edit"
                    >
                      ✎
                    </button>
                    <button 
                      className="icon-btn delete" 
                      onClick={() => handleDeleteTask(todo.id)} 
                      aria-label="Delete"
                      title="Delete"
                    >
                      🗑
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </main>

      {/* FAB Button */}
      <button
        className="fab"
        onClick={() => setShowAddBar(true)}
        aria-label="Add new task"
      >
        <span className="fab-icon">+</span>
      </button>
    </div>
  );
}