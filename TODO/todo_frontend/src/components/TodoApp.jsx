// ✅ File: TodoApp.jsx - Fixed Version
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TodoApp = ({ user, setUser }) => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [editTask, setEditTask] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://todo-app-production-6275.up.railway.app/todos/get', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTodos(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch tasks');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    
    try {
      const res = await axios.post(
        'https://todo-app-production-6275.up.railway.app/todos/add',
        { task: task.trim() },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setTodos([...todos, res.data]);
      setTask('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add task');
      console.error('Add task error:', err);
    }
  };

  const toggleComplete = async (id) => {
    const todo = todos.find(t => t._id === id);
    
    if (!todo) {
      setError('Task not found');
      return;
    }

    // Optimistic update - update UI immediately
    setTodos(prevTodos => 
      prevTodos.map((t) => 
        t._id === id ? { ...t, done: !t.done } : t
      )
    );

    try {
      const updatedData = { 
        task: todo.task, 
        done: !todo.done 
      };
      
      await axios.put(
        `https://todo-app-production-6275.up.railway.app/todos/update/${id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      setError('');
    } catch (err) {
      // If API call fails, revert the optimistic update
      setTodos(prevTodos => 
        prevTodos.map((t) => 
          t._id === id ? { ...t, done: !t.done } : t
        )
      );
      setError(err.response?.data?.error || 'Failed to update task');
      console.error('Toggle complete error:', err);
    }
  };

  const updateTask = async (id) => {
    if (!editValue.trim()) return;
    
    try {
      const existing = todos.find(t => t._id === id);
      
      if (!existing) {
        setError('Task not found');
        return;
      }
      
      const res = await axios.put(
        `https://todo-app-production-6275.up.railway.app/todos/update/${id}`,
        { task: editValue.trim(), done: existing.done },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      setTodos(todos.map((todo) => (todo._id === id ? res.data : todo)));
      setEditTask(null);
      setEditValue('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update task');
      console.error('Update task error:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`https://todo-app-production-6275.up.railway.app/todos/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTodos(todos.filter((todo) => todo._id !== id));
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete task');
      console.error('Delete task error:', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'completed' && todo.done) ||
      (filter === 'pending' && !todo.done);
    const matchesSearch = todo.task.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleShare = () => {
    if (todos.length === 0) return alert("No tasks to share");
    const latest = todos[todos.length - 1];
    const link = `${window.location.origin}/shared-task?id=${latest._id}`;

    if (navigator.share) {
      navigator.share({
        title: 'Shared Task',
        text: `Check out this task from ${user.email}`,
        url: link,
      });
    } else {
      navigator.clipboard.writeText(link);
      alert('Share link copied to clipboard:\n' + link);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-600">Todo List</h2>
          <div className="flex gap-2">
            <p className="text-gray-700 text-sm font-medium self-center">{user.email.split('@')[0]}</p>
            <button 
              onClick={handleShare} 
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
            >
              Share
            </button>
            <button 
              onClick={logout} 
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex justify-between mb-4">
          <div className="flex gap-2">
            <button 
              onClick={() => setFilter('all')} 
              className={`px-3 py-1 rounded transition-colors ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('completed')} 
              className={`px-3 py-1 rounded transition-colors ${
                filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Completed
            </button>
            <button 
              onClick={() => setFilter('pending')} 
              className={`px-3 py-1 rounded transition-colors ${
                filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Pending
            </button>
          </div>
          <input 
            type="text" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search..." 
            className="border border-gray-300 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        <form onSubmit={addTask} className="mb-4 flex gap-2">
          <input 
            type="text" 
            value={task} 
            onChange={(e) => setTask(e.target.value)} 
            placeholder="Add a task..." 
            className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
            required 
          />
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            Add
          </button>
        </form>

        {error && (
          <div className="text-red-500 mb-3 p-2 bg-red-100 rounded">
            {error}
          </div>
        )}

        <ul className="space-y-3">
          {filteredTodos.map((todo) => (
            <li key={todo._id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2 flex-1">
                <input 
                  type="checkbox" 
                  checked={todo.done || false}
                  onChange={() => toggleComplete(todo._id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                {editTask === todo._id ? (
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => updateTask(todo._id)}
                    onKeyDown={(e) => e.key === 'Enter' && updateTask(todo._id)}
                    className="border border-gray-300 px-2 py-1 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span className={`flex-1 ${todo.done ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {todo.task}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {editTask === todo._id ? (
                  <button 
                    onClick={() => updateTask(todo._id)} 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
                  >
                    Save
                  </button>
                ) : (
                  <button 
                    onClick={() => { setEditTask(todo._id); setEditValue(todo.task); }} 
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-3 py-1 rounded transition-colors"
                  >
                    Edit
                  </button>
                )}
                <button 
                  onClick={() => deleteTask(todo._id)} 
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {filteredTodos.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            {todos.length === 0 ? 'No tasks yet. Add your first task!' : 'No tasks match your current filter.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoApp;