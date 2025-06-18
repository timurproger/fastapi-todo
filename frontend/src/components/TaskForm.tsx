import React, { useState, useEffect } from "react";
import './TaskForm.css'

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
    deadline?: string | null;
    type?: string | null;
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
        is_done: initialData.is_done || false,
      });
    } else {
      setForm({
        name: "",
        description: "",
        deadline: "",
        task_type: "",
        is_done: false,
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Name is required");
      return;
    }
    // Подготовка данных для API — соответствуем модели STaskUpdate
    onSave({
      name: form.name,
      description: form.description || undefined,
      deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
      type: form.task_type || null,
      is_done: form.is_done,
    });
  };

  return (
    <div className="taskform-wrapper" onClick={onCancel}>
      <div className="taskform-container" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2 style={{ color: "#403866", marginBottom: "30px", textAlign: "center" }}>
            {initialData ? "Edit Task" : "Create Task"}
          </h2>

          <label style={{ color: "#555", fontSize: "14px" }}>Task Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter task name"
            required
            style={{
              width: "100%",
              height: "40px",
              marginBottom: "20px",
              padding: "0 12px",
              fontSize: "16px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />

          <label style={{ color: "#555", fontSize: "14px" }}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter description (optional)"
            rows={4}
            style={{
              width: "100%",
              marginBottom: "20px",
              padding: "10px 12px",
              fontSize: "16px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              resize: "vertical",
            }}
          />

          <label style={{ color: "#555", fontSize: "14px" }}>Deadline</label>
          <input
            type="datetime-local"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            style={{
              width: "100%",
              height: "40px",
              marginBottom: "20px",
              padding: "0 12px",
              fontSize: "16px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />

          <label style={{ color: "#555", fontSize: "14px" }}>Task Type</label>
          <input
            type="text"
            name="task_type"
            value={form.task_type}
            onChange={handleChange}
            placeholder="e.g. Personal, Work (optional)"
            style={{
              width: "100%",
              height: "40px",
              marginBottom: "30px",
              padding: "0 12px",
              fontSize: "16px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              height: "45px",
              backgroundColor: "#827ffe",
              color: "white",
              fontWeight: "700",
              fontSize: "16px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              marginBottom: "12px",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#403866")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#827ffe")}
          >
            Save
          </button>

          <button
            type="button"
            onClick={onCancel}
            style={{
              width: "100%",
              height: "45px",
              backgroundColor: "#aaa",
              color: "white",
              fontWeight: "700",
              fontSize: "16px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#888")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#aaa")}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
