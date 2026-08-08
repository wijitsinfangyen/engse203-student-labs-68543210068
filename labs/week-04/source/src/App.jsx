import { useState } from 'react';
import AppHeader from './components/AppHeader';
import SummaryPanel from './components/SummaryPanel';
import RequestForm from './components/RequestForm';
import FilterBar from './components/FilterBar';
import RequestList from './components/RequestList';
import { initialRequests } from './data/initialRequests';
import './styles.css';

export default function App() {
  const [requests, setRequests] = useState(initialRequests);
  const [filter, setFilter] = useState('all');

  const handleAddRequest = (newRequest) => {
    setRequests(prev => [newRequest, ...prev]);
  };

  const handleDeleteRequest = (id) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  return (
    <div className="app">
      <AppHeader />
      <main className="container page-grid">
        <div className="left-column">
          <RequestForm onAddRequest={handleAddRequest} />
        </div>
        <div className="right-column">
          <SummaryPanel requests={requests} />
          <div className="panel list-panel">
            <FilterBar currentFilter={filter} onFilterChange={setFilter} />
            <RequestList requests={filteredRequests} onDelete={handleDeleteRequest} />
          </div>
        </div>
      </main>
    </div>
  );
}

import AppHeader from './components/AppHeader.jsx';
import SummaryPanel from './components/SummaryPanel.jsx';
import TaskForm from './components/TaskForm.jsx';
import FilterBar from './components/FilterBar.jsx';
import TaskList from './components/TaskList.jsx';
import { initialTasks } from './data/initialTasks.js';

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [statusFilter, setStatusFilter] = useState('all');
  const summary = {
    total: tasks.length,
    todo: tasks.filter((task) => task.status === 'todo').length,
    doing: tasks.filter((task) => task.status === 'doing').length,
    done: tasks.filter((task) => task.status === 'done').length,
  };
  const filteredTasks = statusFilter === 'all' ? tasks : tasks.filter((task) => task.status === statusFilter);

  function handleAddTask(taskData) {
    const newTask = { id: `TASK-${Date.now()}`, ...taskData, status: 'todo' };
    setTasks((currentTasks) => [newTask, ...currentTasks]);
  }
  function handleDeleteTask(taskId) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  }

  return (
    <>
      <AppHeader title="Study Task Board" subtitle="CP05 — Callback delete และ Conditional Rendering" />
      <main className="container page-content">
        <SummaryPanel summary={summary} />
        <div className="workspace-grid">
          <TaskForm onAddTask={handleAddTask} />
          <section className="panel">
            <FilterBar value={statusFilter} onFilterChange={setStatusFilter} />
            <TaskList tasks={filteredTasks} onDeleteTask={handleDeleteTask} />
          </section>
        </div>
      </main>
    </>
  );
}

export default App;

