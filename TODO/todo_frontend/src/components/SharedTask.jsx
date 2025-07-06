import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SharedTask = () => {
  const [task, setTask] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const token = localStorage.getItem('token');

    if (id && token) {
      axios.get('https://todo-app-production-6275.up.railway.app/todos/get', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const matched = res.data.find(t => t._id === id);
        setTask(matched);
      })
      .catch((err) => console.error(err));
    }
  }, []);

  if (!task) return <p className="text-center mt-10">Loading shared task...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Shared Task</h2>
        <p className="text-lg mb-2"><strong>Task:</strong> {task.task}</p>
        <p><strong>Status:</strong> {task.done ? 'Completed' : 'Pending'}</p>
        <p className="mt-4 text-sm text-gray-500"><strong>Shared by userId:</strong> {task.userId}</p>
      </div>
    </div>
  );
};

export default SharedTask;