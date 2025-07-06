import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TodoApp = ({ user, setUser }) => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [error, setError] = useState('');
  const [editTask, setEditTask] = useState(null);
  const [editValue, setEditValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get('https://todo-app-production-6275.up.railway.app/todos/get', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTodos(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch tasks');
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'https://todo-app-production-6275.up.railway.app/todos/add',
        { task },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setTodos([...todos, res.data]);
      setTask('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add task');
    }
  };

  const toggleComplete = async (id) => {
    try {
      const res = await axios.put(
        `https://todo-app-production-6275.up.railway.app/todos/edit/${id}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setTodos(todos.map((todo) => (todo._id === id ? res.data : todo)));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to edit task');
    }
  };

  const updateTask = async (id) => {
    try {
      const res = await axios.put(
        `https://todo-app-production-6275.up.railway.app/todos/update/${id}`,
        { task: editValue },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setTodos(todos.map((todo) => (todo._id === id ? res.data : todo)));
      setEditTask(null);
      setEditValue('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`https://todo-app-production-6275.up.railway.app/todos/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete task');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-6 transform transition-all duration-300 hover:shadow-3xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-primary bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Todo List
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-lg text-gray-700 font-semibold">
              Welcome, {user.email.split('@')[0]}
            </span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={addTask} className="mb-6">
          <div className="flex space-x-2">
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-200 text-gray-700"
            />
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Add
            </button>
          </div>
        </form>
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-md hover:bg-gray-100 transition duration-200"
            >
              <div className="flex items-center flex-1">
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleComplete(todo._id)}
                  className="mr-3 h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                />
                {editTask === todo._id ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                    onBlur={() => updateTask(todo._id)}
                    onKeyPress={(e) => e.key === 'Enter' && updateTask(todo._id)}
                  />
                ) : (
                  <span
                    className={`flex-1 ${todo.done ? 'line-through text-gray-500' : 'text-gray-800'}`}
                    onClick={() => {
                      if (!todo.done) {
                        setEditTask(todo._id);
                        setEditValue(todo.task);
                      }
                    }}
                  >
                    {todo.task}
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                {editTask !== todo._id && (
                  <>
                    <button
                      onClick={() => {
                        setEditTask(todo._id);
                        setEditValue(todo.task);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition duration-200"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deleteTask(todo._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-200"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoApp;