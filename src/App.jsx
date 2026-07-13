import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTasks } from "./app/redux/task/task.slice";
import {
  addTaskUseCase,
  updateTaskUseCase,
  deleteTaskUseCase,
} from "./usecases/taskUseCase";
import "./App.css";

export default function App() {
  const tasks = useSelector((state) => state.tasks.tasks);
  const loading = useSelector((state) => state.tasks.loading);
  const dispatch = useDispatch();
  
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [inputError, setInputError] = useState("");

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const addTask = () => {
    try {
      const action = addTaskUseCase(input);
      dispatch(action);
      setInput("");
      setInputError("");
    } catch (error) {
      setInputError(error.message);
    }
  };

  const deleteTask = (id) => {
    if (editId === id) resetEdit();
    dispatch(deleteTaskUseCase(id));
  };

  const startEdit = (todo) => {
    setEditId(todo.id);
    setEditText(todo.title);
  };

  const resetEdit = () => {
    setEditId(null);
    setEditText("");
    setInputError("");
  };

  const saveEdit = (id) => {
    try {
      const action = updateTaskUseCase(id, editText);
      dispatch(action);
      resetEdit();
    } catch (error) {
      setInputError(error.message);
    }
  };

  return (
    <div className="app-layout">
      <div className="main-wrapper">
        {inputError && (
          <div className="toast-container">
            <div className="toast-error">
              <span className="toast-icon">!</span>
              <div className="toast-body">
                <p className="toast-title">Invalid email</p>
                <p className="toast-message">{inputError}</p>
              </div>
              <button className="toast-close" onClick={() => setInputError("")} aria-label="Dismiss">✕</button>
            </div>
          </div>
        )}

        <header className="main-header">
          <div className="main-header-text">
            <h1>Email List</h1>
            <p>{tasks.length} email{tasks.length !== 1 ? "s" : ""}</p>
          </div>
        </header>

        <div className="add-row">
          <input
            className={`add-input${inputError ? " add-input-error" : ""}`}
            name="newTask"
            id="newTask"
            placeholder="yourname@gmail.com"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setInputError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <button className="add-btn" onClick={addTask}>Add</button>
        </div>

        <ul className="task-list">
          {loading && <li className="empty-state"><span>Loading…</span></li>}

          {!loading && tasks.length === 0 && (
            <li className="empty-state"><span>No emails yet.</span></li>
          )}

          {tasks.map((todo) => {
            return (
              <li key={todo.id} className="task-item">
                <div className="task-content">
                  {editId === todo.id ? (
                    <input
                      className="edit-input"
                      style={{ width: "100%" }}
                      name={`editTask-${todo.id}`}
                      id={`editTask-${todo.id}`}
                      placeholder="yourname@gmail.com"
                      value={editText}
                      onChange={(e) => {
                        setEditText(e.target.value);
                        setInputError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(todo.id);
                        if (e.key === "Escape") resetEdit();
                      }}
                      autoFocus
                    />
                  ) : (
                    <span className="task-text">{todo.title}</span>
                  )}
                </div>
                
                <div className="task-actions">
                  {editId === todo.id ? (
                    <>
                      <button className="icon-btn save-btn" onClick={() => saveEdit(todo.id)} aria-label="Save">
                        ✓
                      </button>
                      <button className="icon-btn" onClick={resetEdit} aria-label="Cancel">
                        ✕
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="icon-btn" onClick={() => startEdit(todo)} aria-label="Edit">
                        ✎
                      </button>
                      <button className="icon-btn delete-btn" onClick={() => deleteTask(todo.id)} aria-label="Delete">
                        🗑
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}