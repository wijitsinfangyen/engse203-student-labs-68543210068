import { useState } from 'react';

const categories = [
  { value: '', label: 'เลือกหมวดหมู่' },
  { value: 'reading', label: 'Reading' },
  { value: 'coding', label: 'Coding' },
  { value: 'review', label: 'Review' },
];

const priorities = [
  { value: 'normal', label: 'ปกติ' },
  { value: 'high', label: 'สำคัญ' },
];

function TaskForm({ onAddTask }) {
  const [formData, setFormData] = useState({ title: '', category: '', priority: 'normal' });
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));

    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: '' }));
    }
    setStatusMessage('');
  }

  function validate() {
    const nextErrors = {};

    if (!formData.title.trim() || formData.title.trim().length < 3) {
      nextErrors.title = 'หัวเรื่องต้องมีอย่างน้อย 3 ตัวอักษร';
    }

    if (!formData.category) {
      nextErrors.category = 'กรุณาเลือกหมวดหมู่';
    }

    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatusMessage('กรุณาแก้ไขข้อผิดพลาดก่อนส่ง');
      return;
    }

    const newTask = {
      title: formData.title.trim(),
      category: formData.category,
      priority: formData.priority,
    };

    onAddTask(newTask);
    setFormData({ title: '', category: '', priority: 'normal' });
    setErrors({});
    setStatusMessage('เพิ่มงานเรียบร้อยแล้ว');
  }

  return (
    <section className="panel" aria-labelledby="task-form-title">
      <div className="section-heading">
        <h2 id="task-form-title">เพิ่มงาน</h2>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="title">หัวเรื่อง</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            aria-invalid={Boolean(errors.title)}
          />
          <p className="error" role="status">{errors.title || ''}</p>
        </div>

        <div className="field">
          <label htmlFor="category">หมวดหมู่</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            aria-invalid={Boolean(errors.category)}
          >
            {categories.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <p className="error" role="status">{errors.category || ''}</p>
        </div>

        <div className="field">
          <label htmlFor="priority">ความสำคัญ</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            {priorities.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <p className="status" role="status">{statusMessage}</p>
        <button type="submit">เพิ่มงานใหม่</button>
      </form>
    </section>
  );
}

export default TaskForm;
