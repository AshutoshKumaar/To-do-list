'use client';
import React, { useState } from 'react';

function Usersection() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [subtaskInput, setSubtaskInput] = useState('');
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [editTaskIndex, setEditTaskIndex] = useState(null);
  const [editSubtaskIndex, setEditSubtaskIndex] = useState(null);
  const [editInput, setEditInput] = useState('');

  const addTask = () => {
    if (taskInput.trim() === '') return;
    setTasks([...tasks, { text: taskInput, subtasks: [], done: false }]);
    setTaskInput('');
  };

  const addSubtask = (index) => {
    if (subtaskInput.trim() === '') return;
    const updatedTasks = [...tasks];
    updatedTasks[index].subtasks.push({ text: subtaskInput, done: false });
    setTasks(updatedTasks);
    setSubtaskInput('');
  };

  const toggleTaskDone = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].done = !updatedTasks[index].done;
    setTasks(updatedTasks);
  };

  const toggleSubtaskDone = (taskIndex, subtaskIndex) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].subtasks[subtaskIndex].done = !updatedTasks[taskIndex].subtasks[subtaskIndex].done;
    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    if (selectedTaskIndex === index) setSelectedTaskIndex(null);
  };

  const deleteSubtask = (taskIndex, subtaskIndex) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].subtasks = updatedTasks[taskIndex].subtasks.filter((_, i) => i !== subtaskIndex);
    setTasks(updatedTasks);
  };

  const startEditing = (index, isSubtask = false, subtaskIndex = null) => {
    setEditInput(
      isSubtask ? tasks[index].subtasks[subtaskIndex].text : tasks[index].text
    );
    setEditTaskIndex(index);
    if (isSubtask) {
      setEditSubtaskIndex(subtaskIndex);
    } else {
      setEditSubtaskIndex(null);
    }
  };

  const saveEdit = () => {
    const updatedTasks = [...tasks];
    if (editSubtaskIndex !== null) {
      updatedTasks[editTaskIndex].subtasks[editSubtaskIndex].text = editInput;
    } else {
      updatedTasks[editTaskIndex].text = editInput;
    }
    setTasks(updatedTasks);
    setEditTaskIndex(null);
    setEditSubtaskIndex(null);
    setEditInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 text-white px-6 py-10 font-sans">
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
        <h1 className="text-4xl font-bold text-center mb-6">📝 To-Do List</h1>

        {/* Task Input */}
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 p-2 rounded-md text-black"
          />
          <button
            onClick={addTask}
            className="px-4 py-2 bg-white text-blue-700 rounded-md font-medium hover:bg-blue-100"
          >
            Add Task
          </button>
        </div>

        {/* Task List */}
        <ul className="space-y-4">
          {tasks.map((task, index) => (
            <li
              key={index}
              className="p-4 rounded-xl bg-white/20 cursor-pointer hover:bg-blue-700"
            >
              <div className="flex justify-between items-start">
                <div>
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTaskDone(index)}
                    className="mr-2"
                  />
                  {editTaskIndex === index && editSubtaskIndex === null ? (
                    <input
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                      onBlur={saveEdit}
                      className="text-black px-1 rounded"
                    />
                  ) : (
                    <span
                      className={`font-semibold text-lg ${
                        task.done ? 'line-through text-gray-300' : ''
                      }`}
                    >
                      {task.text}
                    </span>
                  )}
                </div>
                <div className="space-x-2">
                  <button onClick={() => startEditing(index)} className="text-yellow-300 text-sm">Edit</button>
                  <button onClick={() => deleteTask(index)} className="text-red-400 text-sm">Delete</button>
                </div>
              </div>

              {/* Subtasks */}
              {task.subtasks.length > 0 && (
                <ul className="ml-6 mt-2 list-disc text-sm text-blue-100 space-y-1">
                  {task.subtasks.map((subtask, subIndex) => (
                    <li key={subIndex} className="flex justify-between">
                      <div>
                        <input
                          type="checkbox"
                          checked={subtask.done}
                          onChange={() => toggleSubtaskDone(index, subIndex)}
                          className="mr-2"
                        />
                        {editTaskIndex === index &&
                        editSubtaskIndex === subIndex ? (
                          <input
                            value={editInput}
                            onChange={(e) => setEditInput(e.target.value)}
                            onBlur={saveEdit}
                            className="text-black px-1 rounded"
                          />
                        ) : (
                          <span
                            className={`${
                              subtask.done ? 'line-through text-gray-300' : ''
                            }`}
                          >
                            {subtask.text}
                          </span>
                        )}
                      </div>
                      <div className="space-x-2 text-xs">
                        <button
                          onClick={() =>
                            startEditing(index, true, subIndex)
                          }
                          className="text-yellow-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteSubtask(index, subIndex)}
                          className="text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Add Subtask Inline */}
              <div className="flex mt-3 gap-2">
                <input
                  type="text"
                  value={selectedTaskIndex === index ? subtaskInput : ''}
                  onChange={(e) => {
                    setSelectedTaskIndex(index);
                    setSubtaskInput(e.target.value);
                  }}
                  placeholder="Add a subtask..."
                  className="flex-1 p-1 rounded text-black text-sm"
                />
                <button
                  onClick={() => addSubtask(index)}
                  className="px-3 py-1 bg-white text-blue-800 text-xs rounded hover:bg-blue-100"
                >
                  Add
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Usersection;
