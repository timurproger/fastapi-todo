import { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import "./Tasks.css";

interface Task {
  id: number;
  name: string;
  description?: string;
  deadline?: string;
  task_type?: string;
  is_done: boolean;
}

interface TasksProps {
  token: string;
  onLogout: () => void;
}

const Tasks: React.FC<TasksProps> = ({ token, onLogout }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Ошибка загрузки задач");
      const data = await res.json();
      setTasks(data);
    } catch {
      alert("Ошибка загрузки задач");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [token]);

  const saveTask = async (taskData: Omit<Task, "id">) => {
    try {
      const method = editingTask ? "PUT" : "POST";
      const url = editingTask
        ? `http://localhost:8000/tasks/${editingTask.id}`
        : "http://localhost:8000/tasks";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (!res.ok) throw new Error("Ошибка сохранения");

      await loadTasks();
      setShowForm(false);
      setEditingTask(null);
    } catch {
      alert("Ошибка сохранения задачи");
    }
  };

  const toggleDone = async (task: Task, isDone: boolean) => {
    try {
      const res = await fetch(`http://localhost:8000/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_done: isDone }),
      });
      if (!res.ok) throw new Error("Ошибка обновления задачи");
      await loadTasks();
    } catch {
      alert("Не удалось обновить статус задачи");
    }
  };

  const deleteTask = async (taskId: number) => {
    if (!window.confirm("Удалить эту задачу?")) return;
    try {
      const res = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Ошибка удаления задачи");
      await loadTasks();
    } catch {
      alert("Ошибка при удалении задачи");
    }
  };

  const closeModal = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="tasks-container">
      <h2>Задачи</h2>
      <div className="task-controls">
        <button
          onClick={() => {
            setEditingTask(null);
            setShowForm(true);
          }}
        >
          Создать задачу
        </button>
        <button onClick={onLogout}>Выйти</button>
      </div>

      {loading && <p className="loading-text">Загрузка задач...</p>}

      {!loading && tasks.length === 0 && (
        <p className="no-tasks-text">У вас пока нет задач.</p>
      )}

      <ul className="tasks-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <input
              type="checkbox"
              checked={task.is_done}
              onChange={(e) => toggleDone(task, e.target.checked)}
              onClick={(e) => e.stopPropagation()}
            />
            <span
              onClick={() => {
                setEditingTask(task);
                setShowForm(true);
              }}
              style={{
                marginLeft: "10px",
                textDecoration: task.is_done ? "line-through" : "none",
                color: task.is_done ? "#999" : "#333",
                cursor: "pointer",
                flexGrow: 1,
              }}
            >
              <b>{task.name}</b> — {task.description || "Описание отсутствует"} —{" "}
              {task.deadline
                ? new Date(task.deadline).toLocaleString()
                : "Без срока"}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteTask(task.id);
              }}
              className="delete-btn"
              title="Удалить задачу"
            >
              🗑
            </button>
          </li>
        ))}
      </ul>

      {showForm && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <TaskForm
              initialData={editingTask || undefined}
              onCancel={closeModal}
              onSave={saveTask}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
