'use client';
import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { db } from '../firebase/config';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase/config';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import {
  collection, addDoc, updateDoc, deleteDoc, doc, setDoc,
  onSnapshot, serverTimestamp
} from 'firebase/firestore';

function Usersection() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [subtaskInput, setSubtaskInput] = useState('');
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTasks, setExpandedTasks] = useState({});

  const tasksCollection = collection(db, 'tasks');
  // For-routhing
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  // 🔁 Real-time Firestore sync
  useEffect(() => {
    const unsubscribe = onSnapshot(tasksCollection, (snapshot) => {
      const fetchedTasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(fetchedTasks);
    });

    return () => unsubscribe();
  }, []);

  const syncTaskToFirestore = async (task) => {
    const docRef = doc(db, 'tasks', task.id);
    await setDoc(docRef, task);
  };

  const addTask = async () => {
    if (!taskInput.trim()) return;
    const newTask = {
      text: taskInput,
      subtasks: [],
      createdAt: serverTimestamp()
    };
    await addDoc(tasksCollection, newTask);
    setTaskInput('');
  };

  const addSubtask = async (index) => {
    if (!subtaskInput.trim()) return;
    const updated = [...tasks];
    const newSub = { text: subtaskInput, done: false };
    updated[index].subtasks.push(newSub);
    await syncTaskToFirestore(updated[index]);
    setTasks(updated);
    setSubtaskInput('');
  };

  const claimSubtask = async (taskIndex, subtaskIndex) => {
    const updated = [...tasks];
    updated[taskIndex].subtasks[subtaskIndex].done = true;
    await syncTaskToFirestore(updated[taskIndex]);
    setTasks(updated);
  };

  const deleteTask = async (index) => {
    const task = tasks[index];
    await deleteDoc(doc(db, 'tasks', task.id));
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const deleteSubtask = async (taskIndex, subtaskIndex) => {
    const updated = [...tasks];
    updated[taskIndex].subtasks = updated[taskIndex].subtasks.filter((_, i) => i !== subtaskIndex);
    await syncTaskToFirestore(updated[taskIndex]);
    setTasks(updated);
  };

  const getProgress = (task) => {
    const total = task.subtasks.length;
    const done = task.subtasks.filter(s => s.done).length;
    return total ? Math.round((done / total) * 100) : 0;
  };

  const toggleSubtasks = (index) => {
    setExpandedTasks(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const filteredTasks = tasks.filter(task =>
    task.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-500 via-blue-600 to-purple-600 text-white px-4 py-10">
  
    {/* Working-view */}
      <div className="max-w-3xl mx-auto bg-white/10 rounded-2xl p-6 shadow-xl">
        <h1 className="text-4xl font-bold text-center mb-8">📋 To-Do Tracker</h1>

        {/* Input Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Type your main task..."
            className="flex-1 px-4 py-2 rounded-md bg-white/10 text-white placeholder-white/70 border border-white/30"
          />
          <button
            onClick={addTask}
            className="bg-cyan-300 hover:bg-cyan-400 text-blue-900 font-medium px-4 py-2 rounded-md"
          >
            Add Task
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className="w-full px-4 py-2 mb-6 rounded-md bg-white/10 text-white border border-white/30"
        />

        {/* Tasks */}
        {filteredTasks.length ? (
          <ul className="space-y-6">
            {filteredTasks.map((task, index) => (
              <li key={task.id} className="bg-white/20 rounded-xl p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="text-xl font-semibold capitalize">{task.text}</h2>
                    <button
                      onClick={() => deleteTask(index)}
                      className="text-red-300 hover:text-red-500 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  <button onClick={() => toggleSubtasks(index)}>
                    {expandedTasks[index] ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {/* Subtasks */}
                {expandedTasks[index] && (
                  <>
                    <ul className="space-y-2 ml-3">
                      {task.subtasks.map((sub, subIndex) => (
                        <li key={subIndex} className="flex justify-between text-sm">
                          <span className={`${sub.done ? 'underline text-slate-100' : ''}`}>{sub.text}</span>
                          <div className="space-x-2">
                            {!sub.done && (
                              <button
                                onClick={() => claimSubtask(index, subIndex)}
                                className="bg-green-400 hover:bg-green-500 text-xs px-2 py-1 rounded"
                              >
                                Claim
                              </button>
                            )}
                            <button
                              onClick={() => deleteSubtask(index, subIndex)}
                              className="text-red-200 text-xs hover:text-red-400"
                            >
                              Delete
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Add Subtask */}
                    <div className="flex mt-4 gap-2 text-sm">
                      <input
                        type="text"
                        value={selectedTaskIndex === index ? subtaskInput : ''}
                        onChange={(e) => {
                          setSelectedTaskIndex(index);
                          setSubtaskInput(e.target.value);
                        }}
                        placeholder="Type a subtask..."
                        className="flex-1 px-3 py-2 rounded-md bg-white/10 text-white border border-white/30"
                      />
                      <button
                        onClick={() => addSubtask(index)}
                        className="bg-white text-indigo-800 px-3 py-2 rounded-md"
                      >
                        Add
                      </button>
                    </div>

                    {/* Progress */}
                    <div className="mt-5">
                      <label className="text-sm">Progress</label>
                      <div className="relative w-full bg-white/30 rounded-full h-4 mt-1">
                        <div
                          className="bg-lime-400 h-4 rounded-full transition-all duration-300"
                          style={{ width: `${getProgress(task)}%` }}
                        />
                        <span className="absolute right-3 top-0.5 text-xs">
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
          <p className="text-center text-white/70 mt-10">No tasks found.</p>
        )}
      </div>
        {/* Login-data */}
    <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white flex flex-col items-center justify-center p-5 rounded-xl">
      <h1 className="text-4xl font-bold mb-4">Welcome, {user?.displayName || "User"}!</h1>
      <button
        onClick={handleLogout}
        className="bg-white text-indigo-700 px-6 py-2 rounded-md font-semibold hover:bg-indigo-100 transition"
      >
        Logout
      </button>

      {/* Your task tracker or UI here below */}
      {/* Example: <Usersection /> or your task component */}
    </div>
    </div>
  );
}

export default Usersection;
