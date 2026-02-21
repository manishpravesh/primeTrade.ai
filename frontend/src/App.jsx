import { useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

const emptyTask = { title: "", description: "", status: "todo" };

const statusLabels = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

const getErrorMessage = async (response) => {
  if (!response) {
    return "Network error";
  }

  try {
    const data = await response.json();
    return data.message || "Request failed";
  } catch (error) {
    return "Request failed";
  }
};

export default function App() {
  const [token, setToken] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [taskForm, setTaskForm] = useState(emptyTask);
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isAuthed = useMemo(() => Boolean(token), [token]);

  const resetAlerts = () => {
    setMessage("");
    setError("");
  };

  const handleAuthChange = (event) => {
    const { name, value } = event.target;
    setAuthForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTaskChange = (event) => {
    const { name, value } = event.target;
    setTaskForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitAuth = async (event) => {
    event.preventDefault();
    resetAlerts();
    setLoading(true);

    const payload = {
      email: authForm.email,
      password: authForm.password,
    };

    if (authMode === "register") {
      payload.name = authForm.name;
      payload.role = authForm.role;
    }

    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/${authMode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setError(await getErrorMessage(response));
        return;
      }

      const data = await response.json();
      setToken(data.token);
      setMessage(`Welcome, ${data.user.name}`);
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken("");
    setTasks([]);
    setTaskForm(emptyTask);
    setMessage("Logged out");
  };

  const fetchTasks = async () => {
    resetAlerts();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/v1/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setError(await getErrorMessage(response));
        return;
      }

      const data = await response.json();
      setTasks(data.items || []);
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (event) => {
    event.preventDefault();
    resetAlerts();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/v1/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskForm),
      });

      if (!response.ok) {
        setError(await getErrorMessage(response));
        return;
      }

      const data = await response.json();
      setTasks((prev) => [data.task, ...prev]);
      setTaskForm(emptyTask);
      setMessage("Task created");
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId, status) => {
    resetAlerts();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/v1/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        setError(await getErrorMessage(response));
        return;
      }

      const data = await response.json();
      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? data.task : task)),
      );
      setMessage("Task updated");
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    resetAlerts();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/v1/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setError(await getErrorMessage(response));
        return;
      }

      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      setMessage("Task deleted");
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="header">
        <div>
          <p className="eyebrow">PrimeTrade</p>
          <h1>Task Control Panel</h1>
          <p className="subtitle">
            Simple UI to exercise auth + task endpoints.
          </p>
        </div>
        <div className="pill">API: {API_BASE}</div>
      </header>

      <section className="panel">
        <div className="panel-head">
          <h2>{authMode === "login" ? "Sign in" : "Create account"}</h2>
          <div className="toggle">
            <button
              type="button"
              className={authMode === "login" ? "active" : ""}
              onClick={() => setAuthMode("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={authMode === "register" ? "active" : ""}
              onClick={() => setAuthMode("register")}
            >
              Register
            </button>
          </div>
        </div>

        <form onSubmit={submitAuth} className="form-grid">
          {authMode === "register" && (
            <label>
              Name
              <input
                type="text"
                name="name"
                value={authForm.name}
                onChange={handleAuthChange}
                required
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              name="email"
              value={authForm.email}
              onChange={handleAuthChange}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              value={authForm.password}
              onChange={handleAuthChange}
              required
            />
          </label>
          {authMode === "register" && (
            <label>
              Role
              <select
                name="role"
                value={authForm.role}
                onChange={handleAuthChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          )}
          <button type="submit" className="primary" disabled={loading}>
            {loading
              ? "Working..."
              : authMode === "login"
                ? "Login"
                : "Register"}
          </button>
          {isAuthed && (
            <button type="button" className="ghost" onClick={logout}>
              Logout
            </button>
          )}
        </form>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Tasks</h2>
          <button
            type="button"
            className="ghost"
            onClick={fetchTasks}
            disabled={!isAuthed || loading}
          >
            Refresh
          </button>
        </div>

        <form onSubmit={createTask} className="form-grid">
          <label>
            Title
            <input
              type="text"
              name="title"
              value={taskForm.title}
              onChange={handleTaskChange}
              required
              disabled={!isAuthed}
            />
          </label>
          <label>
            Description
            <input
              type="text"
              name="description"
              value={taskForm.description}
              onChange={handleTaskChange}
              disabled={!isAuthed}
            />
          </label>
          <label>
            Status
            <select
              name="status"
              value={taskForm.status}
              onChange={handleTaskChange}
              disabled={!isAuthed}
            >
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </label>
          <button
            type="submit"
            className="primary"
            disabled={!isAuthed || loading}
          >
            {loading ? "Saving..." : "Create task"}
          </button>
        </form>

        <div className="task-grid">
          {tasks.length === 0 ? (
            <p className="empty">No tasks yet. Create one.</p>
          ) : (
            tasks.map((task) => (
              <article key={task._id} className="task-card">
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description || "No description"}</p>
                </div>
                <div className="task-meta">
                  <span>{statusLabels[task.status]}</span>
                  <div className="task-actions">
                    <button
                      type="button"
                      onClick={() => updateTask(task._id, "in_progress")}
                      disabled={!isAuthed || loading}
                    >
                      Start
                    </button>
                    <button
                      type="button"
                      onClick={() => updateTask(task._id, "done")}
                      disabled={!isAuthed || loading}
                    >
                      Done
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => deleteTask(task._id)}
                      disabled={!isAuthed || loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {(message || error) && (
        <section className={error ? "alert error" : "alert success"}>
          <strong>{error ? "Error" : "Success"}:</strong> {error || message}
        </section>
      )}
    </div>
  );
}
