import React, { useState, useEffect } from "react";
import "./TaskForm.css";

interface TaskFormProps {
  initialData?: {
    name?: string;
    description?: string;
    deadline?: string;
    task_type?: string;
    is_done?: boolean;
  };
  onSave: (data: {
    name: string;
    description?: string;
    deadline?: string;
    task_type?: string;
    is_done: boolean;
  }) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSave, onCancel }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    deadline: "",
    task_type: "",
    is_done: false,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        deadline: initialData.deadline || "",
        task_type: initialData.task_type || "",
        is_done: initialData.is_done ?? false,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const target = e.target as HTMLInputElement;
  const { name, value, type, checked } = target;
  setForm((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
    }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Название обязательно");
    onSave(form);
  };

  return (
    <div className="limiter">
      <div className="container-login100">
        <div className="wrap-login100">
          <form onSubmit={handleSubmit} className="login100-form">
            <span className="login100-form-title">
              {initialData ? "Редактировать задачу" : "Создать задачу"}
            </span>

            <div className="wrap-input100">
              <input
                className="input100"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Название"
                required
              />
              <span className="focus-input100"></span>
            </div>

            <div className="wrap-input100">
              <textarea
                className="input100"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Описание"
                rows={4}
                style={{ resize: "vertical", paddingTop: "10px" }}
              />
              <span className="focus-input100"></span>
            </div>

            <div className="wrap-input100">
              <input
                className="input100"
                type="datetime-local"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
              />
              <span className="focus-input100"></span>
            </div>

            <div className="wrap-input100">
              <input
                className="input100"
                type="text"
                name="task_type"
                value={form.task_type}
                onChange={handleChange}
                placeholder="Тип задачи"
              />
              <span className="focus-input100"></span>
            </div>

            <div className="wrap-input100" style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                id="is_done"
                name="is_done"
                checked={form.is_done}
                onChange={handleChange}
                style={{ marginRight: "10px", width: "auto" }}
              />
              <label htmlFor="is_done" style={{ fontSize: "16px", color: "#403866" }}>
                Выполнено
              </label>
            </div>

            <div className="container-login100-form-btn" style={{ marginBottom: "10px" }}>
              <button type="submit" className="login100-form-btn">
                Сохранить
              </button>
            </div>

            <div className="container-login100-form-btn">
              <button
                type="button"
                className="login100-form-btn"
                style={{ backgroundColor: "#aaa" }}
                onClick={onCancel}
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
