import { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import "./Tasks.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Task {
  id: number;
  name: string;
  description?: string;
  deadline?: string | null;
  task_type?: string | null;
  is_done: boolean;
  created_at?: string;
}

interface TasksProps {
  token: string;
  onLogout: () => void;
}

const Toolbar: React.FC<{ onCreate: () => void; onLogout: () => void }> = ({
  onCreate,
  onLogout,
}) => (
  <div className="toolbar">
    <button onClick={onCreate}>Create Task</button>
    <button onClick={onLogout} className="logout-btn">Logout</button>
  </div>
);

const Tasks: React.FC<TasksProps> = ({ token, onLogout }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "done" | "not_done">("all");
  const [confirmDeleteTaskId, setConfirmDeleteTaskId] = useState<number | null>(null);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        toast.error("Session expired. Please log in again.");
        onLogout();
        return;
      }

      if (!res.ok) throw new Error("Failed to load tasks");

      const data = await res.json();
      setTasks(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const saveTask = async (taskData: {
    name: string;
    description?: string;
    deadline?: string | null;
    task_type?: string | null;
    is_done: boolean;
  }) => {
    const method = editingTask ? "PUT" : "POST";
    const url = editingTask
      ? `http://localhost:8000/tasks/${editingTask.id}`
      : "http://localhost:8000/tasks";

    const dataToSend = {
      ...taskData,
      deadline: taskData.deadline ?? undefined,
      task_type: taskData.task_type ?? undefined,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const errorText = await res.text();
        toast.error("Error saving task: " + errorText);
        return;
      }

      toast.success("Task saved successfully");
      loadTasks();
      setShowForm(false);
      setEditingTask(null);
    } catch {
      toast.error("Network error saving task.");
    }
  };

  const toggleDone = async (task: Task, isDone: boolean) => {
  setTasks((prev) =>
    prev.map((t) => (t.id === task.id ? { ...t, is_done: isDone } : t))
  );

  try {
    const res = await fetch(`http://localhost:8000/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_done: isDone }), // 👈 фикс здесь
    });

    if (!res.ok) {
      toast.error("Failed to update task status.");
    }
  } catch {
    toast.error("Network error while updating task.");
  }
};



  const deleteTask = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        toast.error("Failed to delete task.");
        return;
      }

      toast.success("Task deleted");
      loadTasks();
    } catch {
      toast.error("Network error while deleting.");
    } finally {
      setConfirmDeleteTaskId(null); // закрыть подтверждение
    }
  };

  const filteredTasks = tasks
    .filter(
      (task) =>
        (task.name.toLowerCase().includes(search.toLowerCase()) ||
          (task.task_type?.toLowerCase().includes(search.toLowerCase()) ?? false)) &&
        (filter === "all" ||
          (filter === "done" && task.is_done) ||
          (filter === "not_done" && !task.is_done))
    )
    .sort((a, b) => {
      const createdA = new Date(a.created_at || "").getTime();
      const createdB = new Date(b.created_at || "").getTime();
      if (createdA !== createdB) return createdB - createdA;

      const deadlineA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const deadlineB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      return deadlineA - deadlineB;
    });

  return (
    <div className="tasks-container">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2>Tasks</h2>

      <div className="fixed-toolbar-container">
        <Toolbar
          onCreate={() => {
            setShowForm(true);
            setEditingTask(null);
          }}
          onLogout={onLogout}
        />
        <div className="search-filter-bar">
          <input
            type="text"
            placeholder="Search by name or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">All</option>
            <option value="not_done">Not Done</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      <div className="tasks-list-scroll">
        {loading && <p className="loading-text">Loading...</p>}
        {!loading && filteredTasks.length === 0 && (
          <p className="no-tasks-text">No tasks found.</p>
        )}

        <ul className="tasks-list">
          {filteredTasks.map((task) => {
            const created = task.created_at
              ? new Date(task.created_at).toLocaleString()
              : "";
            const deadline = task.deadline
              ? new Date(task.deadline).toLocaleString()
              : "";

            return (
              <li
                key={task.id}
                className="task-item"
                style={{
                  backgroundColor: task.is_done ? "#e0e0e0" : undefined,
                  color: task.is_done ? "#999999" : undefined,
                }}
              >
                <input
                  type="checkbox"
                  checked={task.is_done}
                  onChange={(e) => toggleDone(task, e.target.checked)}
                />
                <div
                  className="task-content"
                  onClick={() => {
                    setEditingTask(task);
                    setShowForm(true);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div className="task-header">
                    <div className="task-title" style={{ fontSize: "18px", fontWeight: "bold" }}>
                      {task.name}
                    </div>
                    <div className="task-created">{created}</div>
                  </div>

                  <div className="task-body">
                    <div className="task-desc">
                      <small>Description:</small>
                      <br />
                      {task.description?.slice(0, 60) || "No description"}
                    </div>
                    <div className="task-deadline">
                      <small>Deadline:</small>
                      <br />
                      {deadline || "No deadline"}
                    </div>
                  </div>
                </div>
                <button className="delete-btn" onClick={() => setConfirmDeleteTaskId(task.id)}>
                  🗑
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <TaskForm
              initialData={editingTask ? {
                ...editingTask,
                deadline: editingTask.deadline ?? undefined,
                task_type: editingTask.task_type ?? undefined,
              } : undefined}
              onCancel={() => setShowForm(false)}
              onSave={saveTask}
            />
          </div>
        </div>
      )}

      {/* Кастомное подтверждение удаления */}
      {confirmDeleteTaskId !== null && (
        <div className="modal-overlay" onClick={() => setConfirmDeleteTaskId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Are you sure you want to delete this task?</h3>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
              <button
                onClick={() => deleteTask(confirmDeleteTaskId)}
                style={{ backgroundColor: "#d9534f", color: "white", padding: "10px 20px", borderRadius: "4px" }}
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDeleteTaskId(null)}
                style={{ backgroundColor: "#aaa", color: "white", padding: "10px 20px", borderRadius: "4px" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
