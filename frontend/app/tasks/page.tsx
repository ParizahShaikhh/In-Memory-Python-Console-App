'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/feedback/Alert';
import { LoadingSpinner } from '../components/feedback/LoadingSpinner';
import { EmptyState } from '../components/feedback/EmptyState';
import { Modal } from '../components/ui/Modal';

interface Task {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export default function TasksPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingText, setEditingText] = useState({ title: '', description: '' });
  const [userId, setUserId] = useState<number>(user?.id || 1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      setUserId(user.id);
      fetchTasks();
    }
  }, [userId, isAuthenticated, user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch(`http://localhost:8001/api/${userId}/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      if (response.ok && data.success) {
        setTasks(data.data?.tasks || []);
      } else {
        setError(data.message || 'Failed to fetch tasks');
      }
    } catch (err) {
      setError('Network error: Could not fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTask.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:8001/api/${userId}/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description || null
        }),
      });

      const result = await response.json();

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      if (response.ok) {
        setNewTask({ title: '', description: '' });
        setError(null);
        setSuccess('Task created successfully!');
        fetchTasks();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.message || 'Failed to create task');
      }
    } catch (err) {
      setError('Network error: Could not create task');
      console.error('Error creating task:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTask = async (task: Task) => {
    if (!editingText.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:8001/api/${userId}/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editingText.title,
          description: editingText.description || null
        }),
      });

      const result = await response.json();

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      if (response.ok) {
        setEditingTask(null);
        setEditingText({ title: '', description: '' });
        setError(null);
        setSuccess('Task updated successfully!');
        fetchTasks();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.message || 'Failed to update task');
      }
    } catch (err) {
      setError('Network error: Could not update task');
      console.error('Error updating task:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:8001/api/${userId}/tasks/${task.id}/complete`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          complete: !task.completed
        }),
      });

      const result = await response.json();

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      if (response.ok) {
        setError(null);
        setSuccess(task.completed ? 'Task marked as incomplete' : 'Task completed!');
        fetchTasks();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.message || 'Failed to update task completion');
      }
    } catch (err) {
      setError('Network error: Could not update task completion');
      console.error('Error updating task completion:', err);
    }
  };

  const openDeleteModal = (id: number) => {
    setTaskToDelete(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setTaskToDelete(null);
    setDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (taskToDelete === null) return;

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:8001/api/${userId}/tasks/${taskToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      if (response.ok) {
        setError(null);
        setSuccess('Task deleted successfully!');
        fetchTasks();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.message || 'Failed to delete task');
      }
    } catch (err) {
      setError('Network error: Could not delete task');
      console.error('Error deleting task:', err);
    } finally {
      closeDeleteModal();
    }
  };

  const handleDeleteTask = (id: number) => {
    openDeleteModal(id);
  };

  const startEditing = (task: Task) => {
    setEditingTask(task);
    setEditingText({
      title: task.title,
      description: task.description || ''
    });
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setEditingText({ title: '', description: '' });
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="flex flex-col items-center gap-6">
          <LoadingSpinner size="lg" />
          <p className="text-base text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="flex flex-col items-center gap-6">
          <LoadingSpinner size="lg" />
          <p className="text-base text-zinc-600 dark:text-zinc-400">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black px-4 sm:px-6 md:px-8 py-6 sm:py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
              Task Manager
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Welcome, {user?.username || 'User'}
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={handleLogout}
            size="sm"
          >
            Logout
          </Button>
        </div>

        {error && (
          <div className="mb-6">
            <Alert variant="error" message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        {success && (
          <div className="mb-6">
            <Alert variant="success" message={success} onDismiss={() => setSuccess(null)} />
          </div>
        )}

        {/* Add Task Form */}
        <div className="mb-8 p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Add New Task
          </h2>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <Input
              label="Task Title"
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              placeholder="Enter task title"
              required
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Description (optional)
              </label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Enter task description"
                className="block w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                rows={3}
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Task'}
            </Button>
          </form>
        </div>

        {/* Tasks List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Your Tasks ({tasks.length})
            </h2>
            <Button
              variant="ghost"
              onClick={fetchTasks}
              size="sm"
            >
              Refresh
            </Button>
          </div>

          {tasks.length === 0 ? (
            <EmptyState
              icon={
                <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
              title="No tasks yet"
              description="Get started by creating your first task. Stay organized and track your progress."
              actionLabel="Add Your First Task"
              onAction={() => document.querySelector('input')?.focus()}
            />
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    task.completed
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800 opacity-75'
                      : 'bg-white border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700'
                  }`}
                >
                  {editingTask?.id === task.id ? (
                    <div className="space-y-3">
                      <Input
                        type="text"
                        value={editingText.title}
                        onChange={(e) => setEditingText({...editingText, title: e.target.value})}
                        autoFocus
                      />
                      <textarea
                        value={editingText.description}
                        onChange={(e) => setEditingText({...editingText, description: e.target.value})}
                        className="block w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleUpdateTask(task)}
                          size="sm"
                          disabled={submitting}
                        >
                          {submitting ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={cancelEditing}
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-grow">
                        <button
                          onClick={() => handleToggleComplete(task)}
                          className={`mt-1 w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                            task.completed
                              ? 'bg-green-600 border-green-600'
                              : 'border-zinc-300 dark:border-zinc-600 hover:border-indigo-500'
                          }`}
                          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                        >
                          {task.completed && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <div className="flex-grow">
                          <h3 className={`text-base font-medium ${task.completed ? 'line-through text-zinc-500 dark:text-zinc-500' : 'text-zinc-900 dark:text-zinc-50'}`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className={`text-sm mt-1 ${task.completed ? 'line-through text-zinc-500 dark:text-zinc-500' : 'text-zinc-600 dark:text-zinc-400'}`}>
                              {task.description}
                            </p>
                          )}
                          <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
                            Created: {new Date(task.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          onClick={() => startEditing(task)}
                          size="sm"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteTask(task.id)}
                          size="sm"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
