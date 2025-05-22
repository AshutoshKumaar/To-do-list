'use client';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";


function Usersection() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [subtaskInput, setSubtaskInput] = useState('');
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTasks, setExpandedTasks] = useState({});

  const addTask = () => {
    if (!taskInput.trim()) return;
    setTasks([...tasks, { text: taskInput, subtasks: [] }]);
    setTaskInput('');
  };

  const addSubtask = (index) => {
    if (!subtaskInput.trim()) return;
    const updated = [...tasks];
    updated[index].subtasks.push({ text: subtaskInput, done: false });
    setTasks(updated);
    setSubtaskInput('');
  };

  const claimSubtask = (taskIndex, subtaskIndex) => {
    const updated = [...tasks];
    updated[taskIndex].subtasks[subtaskIndex].done = true;
    setTasks(updated);
  };

  const deleteTask = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  const deleteSubtask = (taskIndex, subtaskIndex) => {
    const updated = [...tasks];
    updated[taskIndex].subtasks = updated[taskIndex].subtasks.filter((_, i) => i !== subtaskIndex);
    setTasks(updated);
  };

  const getProgress = (task) => {
    const total = task.subtasks.length;
    const done = task.subtasks.filter(s => s.done).length;
    return total ? Math.round((done / total) * 100) : 0;
  };

  const toggleSubtasks = (index) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const filteredTasks = tasks.filter(task =>
    task.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-500 via-blue-600 to-purple-600 text-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 drop-shadow-sm">📋 To-Do Tracker</h1>

        {/* Add Task Input */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Type your main task..."
            className="flex-1 px-4 py-2 rounded-md border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition"
          />
          <button
            onClick={addTask}
            className="bg-cyan-300 hover:bg-cyan-400 text-blue-900 font-medium px-4 py-2 rounded-md transition shadow-md"
          >
            Add Task
          </button>
        </div>

        {/* Search Tasks */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full px-4 py-2 rounded-md border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
          />
        </div>

        {/* Task List */}
        {filteredTasks.length > 0 ? (
          <ul className="space-y-6">
            {filteredTasks.map((task, index) => (
              <li key={index} className="bg-white/20 rounded-xl p-5 shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold mb-2 capitalize">{task.text}</h2>
                    <button
                      onClick={() => deleteTask(tasks.indexOf(task))}
                      className="text-red-300 hover:text-red-500 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  <button
                    onClick={() => toggleSubtasks(index)}
                    className={`text-white text-xl transition-transform duration-300`}
                  >
                   {
                    expandedTasks[index] ? <FaEyeSlash className='duration-300 ease-in-out' /> : <FaEye  className='duration-300 ease-in-out' /> 
                   }
                  </button>
                </div>

                {/* Subtask Section (conditionally shown) */}
                {expandedTasks[index] && (
                  <>
                    {/* Subtasks */}
                    <ul className="space-y-2 ml-3">
                      {task.subtasks.map((sub, subIndex) => (
                        <li
                          key={subIndex}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className={`capitalize ${sub.done ? 'underline text-slate-100' : ''}`}>
                            {sub.text}
                          </span>
                          <div className="space-x-2">
                            {!sub.done && (
                              <button
                                onClick={() => claimSubtask(tasks.indexOf(task), subIndex)}
                                className="bg-green-400 hover:bg-green-500 text-xs px-2 py-1 rounded-md transition"
                              >
                                Claim
                              </button>
                            )}
                            <button
                              onClick={() => deleteSubtask(tasks.indexOf(task), subIndex)}
                              className="text-red-200 text-xs hover:text-red-400"
                            >
                              Delete
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Add Subtask */}
                    <div className="flex flex-col sm:flex-row mt-4 gap-2 text-sm">
                      <input
                        type="text"
                        value={selectedTaskIndex === tasks.indexOf(task) ? subtaskInput : ''}
                        onChange={(e) => {
                          setSelectedTaskIndex(tasks.indexOf(task));
                          setSubtaskInput(e.target.value);
                        }}
                        placeholder="Type a subtask..."
                        className="flex-1 px-3 py-1.5 rounded-md border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-violet-300 transition"
                      />
                      <button
                        onClick={() => addSubtask(tasks.indexOf(task))}
                        className="bg-white text-indigo-800 text-xs font-medium px-3 py-1.5 rounded-md hover:bg-gray-100 transition shadow-sm"
                      >
                        Add
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-5">
                      <label className="text-sm font-light">Progress</label>
                      <div className="relative w-full bg-white/30 rounded-full h-4 mt-1">
                        <div
                          className="bg-lime-400 h-4 rounded-full transition-all duration-300"
                          style={{ width: `${getProgress(task)}%` }}
                        ></div>
                        <span className="absolute right-3 top-0.5 text-xs text-white font-light">
                          {getProgress(task)}% done
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-sm text-white/70 mt-10">No tasks found.</p>
        )}
      </div>
    </div>
  );
}

export default Usersection;
